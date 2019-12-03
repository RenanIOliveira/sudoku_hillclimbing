#include <iostream>
#include <stdlib.h>
#include <string.h>
#include <time.h>

using namespace std;

int algarismos[] = {1,2,3,4,5,6,7,8,9};

int board[81] = {0,0,0,7,0,0,0,0,0,
                 1,0,0,0,0,0,0,0,0,
                 0,0,0,4,3,0,2,0,0,
                 0,0,0,0,0,0,0,0,6,
                 0,0,0,5,0,9,0,0,0,
                 0,0,0,0,0,0,4,1,8,
                 0,0,0,0,8,1,0,0,0,
                 0,0,2,0,0,0,0,5,0,
                 0,4,0,0,0,0,3,0,0};

int * fill_board(int * board);

int objetivo(int * board);

int main() {

  int no_corrente[81];

  memcpy(no_corrente,fill_board(board), sizeof(int[81]));

  for (int i = 0; i < 81; i++) {
    if (i % 9 == 8) {
      cout << no_corrente[i] << '\n';
    }
    else{
      cout << no_corrente[i] << ", " ;
    }
  };

  return 0;
}

int * fill_board(int * board){
  int i;

  srand(time(0));

  for (i = 0; i < 81; i++) {
    if (board[i] == 0){
        board[i] = algarismos[rand()%9];
    }
  }

  return board;
}

int objetivo(int * board){
  int retorno = 0;
  for (int i = 0; i < 81; i++) {
    /* code */
  }
}
