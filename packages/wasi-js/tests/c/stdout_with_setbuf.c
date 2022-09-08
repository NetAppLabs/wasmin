#include <stdio.h>


int main(){
  setbuf(stdout, NULL);

  printf("%d", 42);
  return 0;
}
