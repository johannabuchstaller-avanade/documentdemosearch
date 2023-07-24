import { JData } from "types";

export function  getKeysfromJson(incident: JData){
    let keysWithUnknownValue = "";

    let num = 1;
    for (const key in incident) {
      if (incident.hasOwnProperty(key) && incident[key] === "Unknown") {
        keysWithUnknownValue +=  "\n" + String(num) + '. ' + key;
        num += 1;
      }
    }
    return keysWithUnknownValue;
}


export function changeJsonUtils(ukJson:any, secondJson:any) {
  let json1 = ukJson;
  let json2 = secondJson;
  let json3 = {} as any;
  for (const key in json1) {
    if (json1.hasOwnProperty(key)  && json1[key] !== "Unknown") {
      json3[key] = json1[key];
    }
  }
  for (const key in json2) {
    if (json2.hasOwnProperty(key)) {
      json3[key] = json2[key];
    }
  }
  return json3;
}


export function removeobject2fromobject1(obj1:any, obj2:any): any{
  const filteredKeys = Object.keys(obj1).filter(key => !obj2.hasOwnProperty(key));
  const result = Object.fromEntries(filteredKeys.map(key => [key, obj1[key]]));
  return result;
}
