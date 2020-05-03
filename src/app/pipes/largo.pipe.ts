import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'largo'
})
export class LargoPipe implements PipeTransform {

  transform(value: string): string {
    if (value == null) { return; }
    const final = value;
    if (final.length <= 200) {
      return final;
    }
    for (let i = 199; i <= final.length; i++) {
      if (final[i] === ' ') {
        return final.substring(0, i) + '...';
      }
    }
    return final;
  }

}
