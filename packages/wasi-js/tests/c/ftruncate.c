#include <sys/stat.h>
#include <assert.h>
#include <fcntl.h>
#include <unistd.h>

#define BASE_DIR "/tmp"
#define OUTPUT_DIR BASE_DIR "/testdir-truncate"
#define PATH OUTPUT_DIR "/output.txt"

int main(void) {
  struct stat st;
  int fd;

  (void)st;
  assert(0 == mkdir(OUTPUT_DIR, 0755));

  fd = open(PATH, O_CREAT | O_WRONLY, 0666);
  assert(fd != -1);

  /* Verify that the file is initially empty. */
  assert(0 == fstat(fd, &st));
  assert(st.st_size == 0);
  assert(0 == lseek(fd, 0, SEEK_CUR));

  /* Increase the file size using ftruncate(). */
  assert(0 == ftruncate(fd, 500));
  assert(0 == fstat(fd, &st));
  assert(st.st_size == 500);
  assert(0 == lseek(fd, 0, SEEK_CUR));

  /* Truncate the file using ftruncate(). */
  assert(0 == ftruncate(fd, 300));
  assert(0 == fstat(fd, &st));
  assert(st.st_size == 300);
  assert(0 == lseek(fd, 0, SEEK_CUR));

  assert(0 == close(fd));

  assert(0 == unlink(PATH));
  assert(-1 == stat(PATH, &st));

  assert(0 == rmdir(OUTPUT_DIR));
  assert(-1 == stat(OUTPUT_DIR, &st));

  return 0;
}
