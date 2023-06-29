#include <stdio.h>

__attribute__((export_name("sum")))
int sum(int a, int b) {
  return a + b;
}

__attribute__((export_name("div")))
float div(int a, int b) {
  return (float)a / (float)b;
}

int main() {
  setbuf(stdout, NULL);
  int a = 10;
  int b = 3;

  printf("%d + %d = %d\n", a, b, sum(a, b));
  printf("%d / %d = %3.2f\n", a, b, div(a, b));

  return 0;
}
