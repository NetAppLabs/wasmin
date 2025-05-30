#include <sys/stat.h>

#include <assert.h>
#include <fcntl.h>
#include <time.h>
#include <unistd.h>
#include <stdio.h>

#define BASE_DIR "/tmp"
#define OUTPUT_DIR BASE_DIR "/testdir-stat"
#define PATH OUTPUT_DIR "/output.txt"
#define SIZE 500

int main(void) {
  setbuf(stdout, NULL);

  struct stat st;
  int fd;
  int ret;
  off_t pos;

  (void)st;
  ret = mkdir(OUTPUT_DIR, 0755);
  assert(ret == 0);

  fd = open(PATH, O_CREAT | O_WRONLY, 0666);
  assert(fd != -1);

  pos = lseek(fd, SIZE - 1, SEEK_SET);
  assert(pos == SIZE - 1);

  ret = (int)write(fd, "", 1);
  assert(ret == 1);

  ret = fstat(fd, &st);
  assert(ret == 0);
  printf("---%lld\n",st.st_size);
  assert(st.st_size == SIZE);

  ret = close(fd);
  assert(ret == 0);

  ret = access(PATH, R_OK);
  assert(ret == 0);

  ret = stat(PATH, &st);
  assert(ret == 0);
  assert(st.st_size == SIZE);

  ret = unlink(PATH);
  assert(ret == 0);

  ret = stat(PATH, &st);
  assert(ret == -1);

  ret = stat(OUTPUT_DIR, &st);
  assert(ret == 0);
  assert(S_ISDIR(st.st_mode));

  ret = rmdir(OUTPUT_DIR);
  assert(ret == 0);

  ret = stat(OUTPUT_DIR, &st);
  assert(ret == -1);

  return 0;
}
