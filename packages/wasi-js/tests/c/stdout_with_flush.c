#include <stdio.h>

int main(){
  printf("%d", 1);
  fflush(stdout);
  printf("%d\n", 2);
  printf("%d", 3);
  printf("%d", 4);
  return 0;
}
