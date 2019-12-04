#include <iostream>
#include <stdlib.h>
#include <string.h>
#include <time.h>
#include <map>
#include <vector>
#include <bits/stdc++.h>
#include <algorithm>

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

int fixed_positions[] = {3,  9,  21, 22, 24, 35, 39, 41, 51, 52, 53, 58, 59, 65, 70, 73, 78};

const int squares[9][9] = {{0,1,2,9,10,11,18,19,20},{3,4,5,12,13,14,21,22,23},{6,7,8,15,16,17,24,25,26},
                         {27,28,29,36,37,38,45,46,47},{30,31,32,39,40,41,48,49,50},{33,34,35,42,43,44,51,52,53},
                         {54,55,56,63,64,65,72,73,74},{57,58,59,66,67,68,75,76,77},{60,61,62,69,70,71,78,79,80}};

int * fill_board(int * board);
int repete_linhas(int * board);
int repete_colunas(int * board);
int repete_squares(int * board);
int * choose_son(int * board, int position);
void print_board(int * board);

int objetivo(int * board);

int main() {

  int no_corrente[81];
  int novo[81];

  memcpy(no_corrente,fill_board(board), sizeof(int[81]));

  cout << "Sudoku inicial:" << objetivo(no_corrente) << '\n';

  print_board(no_corrente);

  cout << "Função objetivo:" << objetivo(no_corrente) << "\n\n";

  for (int i = 0; i < 81; i++) {
    if (objetivo(no_corrente) == 0)
      break;
    else{
      memcpy(no_corrente,choose_son(no_corrente,i), sizeof(int[81]));
    }
  }

  cout << "Minimo encontrado:" << '\n';

  print_board(no_corrente);

  cout << "Função objetivo:" << objetivo(no_corrente) << '\n';

  return 0;
}

void print_board(int * board) {
  for (int i = 0; i < 81; i++) {
    if (i % 9 == 8) {
      cout << board[i] << '\n';
    }
    else{
      cout << board[i] << ", " ;
    }
  };
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
  return repete_squares(board) + repete_colunas(board) + repete_squares(board);
}

int repete_linhas(int * board){
  int total = 0;
  map<int, int> frequency;
  vector<int> data;
  for (int i = 0; i < 9; i++) {
    data.clear();
    frequency.clear();
    for (int j = 0; j < 9; j++) {
      data.insert(data.begin(),board[i*j + j]);
    }
    for(int i: data)
        ++frequency[i];
    for(const auto& e: frequency){
      if (e.second != 1) {
        total+=e.second;
      }
//    cout << "Element " << e.first << " encountered " << e.second << " times\n";
    }
//  cout << "------" << '\n';
  }
//  cout << "total: " << total << '\n';
  return total;
}

int repete_colunas(int * board){
  int total = 0;
  map<int, int> frequency;
  vector<int> data;
  for (int i = 0; i < 9; i++) {
    data.clear();
    frequency.clear();
    for (int j = 0; j < 9; j++) {
      data.insert(data.begin(),board[i+j*9]);
    }
    for(int i: data)
        ++frequency[i];
    for(const auto& e: frequency){
      if (e.second != 1) {
        total+=e.second;
      }
//    cout << "Element " << e.first << " encountered " << e.second << " times\n";
    }
//    cout << "------" << '\n';
  }
//  cout << "total: " << total << '\n';
  return total;
}

int repete_squares(int * board){
  int total = 0;
  map<int, int> frequency;
  vector<int> data;
  for (int i = 0; i < 9; i++) {
    data.clear();
    frequency.clear();
    for (int j = 0; j < 9; j++) {
      data.insert(data.begin(),board[squares[i][j]]);
    }
    for(int i: data)
        ++frequency[i];
    for(const auto& e: frequency){
      if (e.second != 1) {
        total+=e.second;
      }
//      cout << "Element " << e.first << " encountered " << e.second << " times\n";
    }
//    cout << "------" << '\n';
  }
//  cout << "total: " << total << '\n';
  return total;
}

int * choose_son(int * board,int position){
  int compara[81];
  int * p;
  int valor_atual = board[position];
  int i;
  memcpy(compara, board, sizeof(int[81]));
  p = find (fixed_positions, fixed_positions+17, position);
  if (p != fixed_positions+17)
    return board;
  else{
    for (i = 1; i <= 9; i++) {
      if (valor_atual != i) {
        compara[position] = i;
        if (objetivo(compara) < objetivo(board))
          memcpy(board, compara, sizeof(int[81]));
      }
    }
  }
  return board;
}
