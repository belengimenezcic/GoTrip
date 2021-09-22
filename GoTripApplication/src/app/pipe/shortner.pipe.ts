import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shortner'
})
export class ShortnerPipe implements PipeTransform {
  transform(value: any, limit: number) {
    if(value.length > limit){
      return value.substr(0, limit) + '...';
    }
    return value;
  }
}
