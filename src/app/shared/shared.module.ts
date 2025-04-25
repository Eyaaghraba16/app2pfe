import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SearchBarComponent } from './search-bar/search-bar.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SearchBarComponent
  ],
  exports: [
    CommonModule,
    FormsModule,
    SearchBarComponent
  ]
})
export class SharedModule { }
