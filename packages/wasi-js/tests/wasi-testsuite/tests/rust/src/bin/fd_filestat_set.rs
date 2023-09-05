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

    // there can be lost precision issues
    let precision = 10_000_000;

    // Check fd_filestat_set_times
    let old_atim = stat.atim;
    let old_mtim_floored = (stat.mtim / precision) * precision;

    let difference = 1000 * precision;
    let new_mtim = old_mtim_floored - difference;
    wasi::fd_filestat_set_times(file_fd, new_mtim, new_mtim, wasi::FSTFLAGS_MTIM)
        .expect("fd_filestat_set_times");

    let stat = wasi::fd_filestat_get(file_fd).expect("failed filestat 3");
    assert_eq!(stat.size, 100, "file size should remain unchanged at 100");
    let stat_mtim = stat.mtim;
    let stat_mtim_rounded = to_rounded_ms(stat_mtim, precision);
    let stat_atim = stat.atim;
    let stat_atim_rounded = to_rounded_ms(stat_atim, precision);

    let new_mtim_rounded_precision = to_rounded_ms(new_mtim, precision);
    let old_atim_rounded_precision = to_rounded_ms(old_atim, precision);

    assert_eq!(stat_mtim_rounded, new_mtim_rounded_precision, "mtim should change");
    assert_eq!(to_rounded_ms(stat_atim_rounded, 100 * precision), to_rounded_ms(old_atim_rounded_precision, 100 * precision), "atim should not change");

    let status = wasi::fd_filestat_set_times(file_fd, new_mtim, new_mtim, wasi::FSTFLAGS_MTIM | wasi::FSTFLAGS_MTIM_NOW);
    assert_eq!(status.unwrap_err(), wasi::ERRNO_INVAL, "ATIM & ATIM_NOW can't both be set");

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

fn to_rounded_ms(old_time: u64, precision: u64) -> u64{
    let old_time_rounded = (((old_time as f64/ precision as f64) as f64).round() as u64 ) * precision;
    //let old_time_rounded = (old_time / precision) * precision;
    return old_time_rounded;
}