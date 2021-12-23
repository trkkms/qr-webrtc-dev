mod utils;

use flate2::read::DeflateDecoder;
use flate2::write::DeflateEncoder;
use flate2::Compression;
use qrcode_generator::{to_svg_to_string, QrCodeEcc};
use std::io::{BufRead, BufReader, Read, Write};
use wasm_bindgen::prelude::*;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
extern "C" {
    fn alert(s: &str);

    #[wasm_bindgen(js_namespace = console, js_name = log)]
    fn log_uint8array(a: &[u8]);

    #[wasm_bindgen(js_namespace = console, js_name = log)]
    fn log_string(s: &str);
}

#[wasm_bindgen]
pub fn greet() {
    alert("Hello, wasm!");
}

#[wasm_bindgen]
pub fn compress(s: &str) -> Option<Vec<u8>> {
    let mut e = DeflateEncoder::new(Vec::new(), Compression::best());
    e.write_all(s.as_bytes()).ok().and_then(|_| e.finish().ok())
}

#[wasm_bindgen]
pub fn into_svg(input: &[u8], size: usize) -> Option<String> {
    to_svg_to_string(input, QrCodeEcc::Low, size, None::<&str>).ok()
}

#[wasm_bindgen]
pub fn inflate(bytes: &[u8]) -> Option<String> {
    let mut d = DeflateDecoder::new(bytes);
    let mut buf = String::new();
    match d.read_to_string(&mut buf) {
        Ok(_) => Some(buf),
        Err(_) => None,
    }
}

#[wasm_bindgen]
pub fn foo() {}
