#![deny(clippy::all)]

use napi_derive::napi;
use {
  crossterm::{
      terminal,
  },
};

#[napi]
fn term_set_raw_mode(mode: u32,) -> u32{
  let res = 0;
  if mode == 1 {
      let _ = terminal::enable_raw_mode();
  } else if mode == 0 {
      let _ = terminal::disable_raw_mode();
  }
  return res;
}

#[napi]
fn term_get_raw_mode() -> u32{
  let mut ret = 0;
  let rraw = terminal::is_raw_mode_enabled();
  match rraw{
      Ok(raw) => {
          if raw == true {
              ret = 1;
          }
      },
      Err(_) => {},
  }
  return ret
}