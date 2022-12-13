import { NgModule, APP_INITIALIZER } from '@angular/core';
import { CommonModule } from '@angular/common';


// Components
import { DetailComponent } from './components/detail/detail.component';
//import { TranslatePipe } from '../pipes/translate.pipe';



@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    DetailComponent
  ],
  exports: [
    DetailComponent
  ],

})
export class SharedModule { }
