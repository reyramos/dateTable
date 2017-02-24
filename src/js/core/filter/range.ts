/**
 * Created by ramor11 on 5/1/2016.
 *  ng-repeat="p in [] | range:3 track by $index"
 */
export function Range() {
    return (input: Array<any>, total: number)=> {
        total = Math.floor(total);
        for (var i = 0; i < total; i++) {
            input.push(i + 1);
        }
        return input;
    }

}
