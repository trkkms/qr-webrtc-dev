import * as t from 'io-ts';
import { deferredPromise } from 'src/common/util';
import { HostToGuestPeer } from 'src/services/host-service';
import { AppLogger } from 'src/states/app';

const acceptGuest = t.type({
  type: t.literal('acceptGuest'),
  guestId: t.string,
  others: t.array(
    t.type({
      id: t.string,
      name: t.string,
    }),
  ),
});
export type AcceptGuest = t.TypeOf<typeof acceptGuest>;

const offer = t.type({
  type: t.literal('offer'),
  from: t.string,
  name: t.string,
  to: t.string,
  sdp: t.string,
});
type Offer = t.TypeOf<typeof offer>;

const acceptHost = t.type({
  type: t.literal('acceptHost'),
  guestId: t.string,
  name: t.string,
  offers: t.array(offer),
});
type AcceptHost = t.TypeOf<typeof acceptHost>;

const answer = t.type({
  type: t.literal('answer'),
  from: t.string,
  to: t.string,
  sdp: t.string,
});
type Answer = t.TypeOf<typeof answer>;

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const createGuestSignalService = (
  name: string,
  getChannel: () => Promise<RTCDataChannel>,
  preparePeer: (peer: RTCPeerConnection) => void,
  logger: AppLogger,
  onStateChange: () => void,
) => {
  type GuestPeer = { id: string; name: string; peer: RTCPeerConnection };
  const peers = new Map<string, GuestPeer>();
  const [setID, getID] = deferredPromise<string>();
  getChannel().then(async (channel) => {
    channel.onmessage = async (ev) => {
      const message = JSON.parse(ev.data);
      if (acceptGuest.is(message)) {
        logger.info('accepted by host');
        const id = message.guestId;
        setID(message.guestId);
        const offers: Offer[] = [];
        for (const other of message.others) {
          const peer = new RTCPeerConnection({ iceServers: [] });
          preparePeer(peer);
          const guest: GuestPeer = { peer, id: other.id, name: other.name };
          peers.set(other.id, guest);
          await peer.setLocalDescription(
            await peer.createOffer({ offerToReceiveAudio: true, offerToReceiveVideo: false }),
          );
          const sdp = await new Promise<string>((resolve) => {
            peer.onicecandidate = (ev) => {
              if (!ev.candidate && peer.localDescription) {
                resolve(peer.localDescription.sdp);
              }
            };
          });
          offers.push({ type: 'offer', from: id, to: other.id, name, sdp });
          peer.onconnectionstatechange = () => {
            logger.info(`connection state change to ${guest.id}: ${peer.connectionState}`);
            onStateChange();
          };
        }
        const accept: AcceptHost = {
          type: 'acceptHost',
          guestId: id,
          offers: offers,
          name,
        };
        channel.send(JSON.stringify(accept));
      }
      if (offer.is(message)) {
        logger.info(`received offer from: ${message.from}`);
        const id = await getID();
        const peer = new RTCPeerConnection({ iceServers: [] });
        preparePeer(peer);
        peers.set(message.from, { id: message.from, peer, name: message.name });
        await peer.setRemoteDescription({ type: 'offer', sdp: message.sdp });
        await peer.setLocalDescription(await peer.createAnswer());
        peer.onconnectionstatechange = () => {
          logger.info(`connection state change to ${message.from}: ${peer.connectionState}`);
          onStateChange();
        };
        const sdp = await new Promise<string>((resolve) => {
          peer.onicecandidate = (ev) => {
            if (!ev.candidate && peer.localDescription) {
              resolve(peer.localDescription.sdp);
            }
          };
        });
        const answer: Answer = {
          type: 'answer',
          from: id,
          to: message.from,
          sdp,
        };
        channel.send(JSON.stringify(answer));
      }
      if (answer.is(message)) {
        logger.info(`received answer from ${message.from}`);
        const peer = peers.get(message.from);
        if (peer == undefined) {
          return;
        }
        peer.peer.onconnectionstatechange = () => {
          logger.info(`connection state change to ${message.from}: ${peer.peer.connectionState}`);
          onStateChange();
        };
        await peer.peer.setRemoteDescription({ type: 'answer', sdp: message.sdp });
      }
    };
  });
  return { peers };
};

export const createHostSignalService =
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  (peers: Map<string, HostToGuestPeer>, logger: AppLogger) => (from: string, message: unknown) => {
    if (acceptHost.is(message)) {
      logger.info(`${message.guestId.slice(0, 5)} / accepted by guest`);
      const peer = peers.get(message.guestId);
      if (peer == undefined) {
        return;
      }
      peer.setName(message.name);
      for (const offer of message.offers) {
        logger.info(`${offer.to.slice(0, 5)} / sending offer`);
        const to = peers.get(offer.to);
        if (to == undefined) {
          continue;
        }
        to.sendMessage(offer);
      }
    }
    if (answer.is(message)) {
      const to = peers.get(message.to);
      logger.info(`${message.to.slice(0, 5)} / sending answer from ${message.from.slice(0, 5)}`);
      if (to == undefined) {
        return;
      }
      to.sendMessage(message);
    }
  };
