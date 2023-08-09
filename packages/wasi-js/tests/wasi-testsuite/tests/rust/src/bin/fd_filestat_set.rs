use std::{env, process};
use wasi_tests::open_scratch_directory;

unsafe fn test_fd_filestat_set(dir_fd: wasi::Fd) {
    const FILE_NAME: &str = "fd_filestat_set_file.cleanup";
    // Create a file in the scratch directory.
    let file_fd = wasi::path_open(
        dir_fd,
        0,
        FILE_NAME,
        wasi::OFLAGS_CREAT,
        wasi::RIGHTS_FD_READ
            | wasi::RIGHTS_FD_WRITE
            | wasi::RIGHTS_FD_FILESTAT_GET
            | wasi::RIGHTS_FD_FILESTAT_SET_SIZE
            | wasi::RIGHTS_FD_FILESTAT_SET_TIMES,
        0,
        0,
    )
    .expect("failed to create file");
    assert!(
        file_fd > libc::STDERR_FILENO as wasi::Fd,
        "file descriptor range check",
    );

    // Check file size
    let stat = wasi::fd_filestat_get(file_fd).expect("failed filestat");
    assert_eq!(stat.size, 0, "file size should be 0");

    // Check fd_filestat_set_size
    wasi::fd_filestat_set_size(file_fd, 100).expect("fd_filestat_set_size");

    let stat = wasi::fd_filestat_get(file_fd).expect("failed filestat 2");
    assert_eq!(stat.size, 100, "file size should be 100");

    // Check fd_filestat_set_times
    let old_atim = stat.atim;
    // there can be lost precision issues
    let precision = 1_000_000;
    let difference = 10 * precision; 
    let new_mtim = stat.mtim - difference;
    wasi::fd_filestat_set_times(file_fd, new_mtim, new_mtim, wasi::FSTFLAGS_MTIM)
        .expect("fd_filestat_set_times");

    let stat = wasi::fd_filestat_get(file_fd).expect("failed filestat 3");
    assert_eq!(stat.size, 100, "file size should remain unchanged at 100");
    let mut got_mtim = stat.mtim;
    got_mtim = (((got_mtim / precision) as f64).floor() as u64 ) * precision;
    let mut got_atim = stat.atim;
    got_atim = (((got_atim / precision) as f64).floor() as u64 ) * precision;

    let new_mtim_floored = (((new_mtim / precision) as f64).floor() as u64 ) * precision;
    let old_atim_floored = (((old_atim / precision) as f64).floor() as u64 ) * precision;
    assert_eq!(got_mtim, new_mtim_floored, "mtim should change");
    assert_eq!(got_atim, old_atim_floored, "atim should not change");

    // let status = wasi_fd_filestat_set_times(file_fd, new_mtim, new_mtim, wasi::FILESTAT_SET_MTIM | wasi::FILESTAT_SET_MTIM_NOW);
    // assert_eq!(status, wasi::EINVAL, "ATIM & ATIM_NOW can't both be set");

    wasi::fd_close(file_fd).expect("failed to close fd");
    wasi::path_unlink_file(dir_fd, FILE_NAME).expect("failed to remove dir");
}
fn main() {
    let mut args = env::args();
    let prog = args.next().unwrap();
    let arg = if let Some(arg) = args.next() {
        arg
    } else {
        eprintln!("usage: {} <scratch directory>", prog);
        process::exit(1);
    };

    // Open scratch directory
    let dir_fd = match open_scratch_directory(&arg) {
        Ok(dir_fd) => dir_fd,
        Err(err) => {
            eprintln!("{}", err);
            process::exit(1)
        }
    };

    // Run the tests.
    unsafe { test_fd_filestat_set(dir_fd) }
}
