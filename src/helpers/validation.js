

function isEmail(){

}

function isUUID(){

}

function isJSONEntriesNullorEmpty(json, mode=0){

  let elements = Object.entries(json)
  let index

  if(mode == 1){
    index = elements.findIndex((x) => x[1] == "")
  } else {
    index = elements.findIndex((x) => x[1] == undefined)
  }

  if(index != -1){
    return elements[index][0]
  }
  return false
}

// verificar se um conjundo de string esta vazio
function isEmpty(value){
  if(typeof value == 'string'){
    return value == ""? true: false;

  } else if (typeof value == "object") {
    return isJSONEntriesNullorEmpty(value, 1)

  } else {
    throw new Error('Parametro Invalido')
  }
}

function verifyEntries(json){
  let boolTest;

  boolTest = isJSONEntriesNullorEmpty(json)

  if(boolTest){
    return boolTest;
  }

  boolTest = isJSONEntriesNullorEmpty(json, 1)

  if(boolTest){
    return boolTest;
  }

}

function CheckTypes(){

}

function isGeoCoordinates(){

}


function LengthChecker(){

}

function isMobilePhone(){

}

function isJSON(){

}

function isDate(){

}

function isByteLength(){

}

function isCNPJ(){

}

function isCPF(){

}

export {
  isByteLength,
  isCNPJ,
  isCPF,
  isDate,
  isEmail,
  isJSON,
  isJSONEntriesNullorEmpty,
  isMobilePhone,
  isEmpty,
  isUUID,
  LengthChecker,
  CheckTypes,
  verifyEntries
}