
function Dollar (val) {  // force to valid dollar amount
var str,pos,rnd=0;
  if (val < .995) rnd = 1;  // for old Netscape browsers
  str = escape (val*1.0 + 0.005001 + rnd);  // float, round, escape
  pos = str.indexOf (".");
  if (pos > 0) str = str.substring (rnd, pos + 3);
  return str;
}

var amt,des,obj,val,op1a,op1b,op2a,op2b,itmn;

function ChkTok (obj1) {
var j,tok,ary=new Array ();       // where we parse
  ary = val.split (" ");          // break apart
  for (j=0; j<ary.length; j++) {  // look at all items
// first we do single character tokens...
    if (ary[j].length < 2) continue;
    tok = ary[j].substring (0,1); // first character
    val = ary[j].substring (1);   // get data
    if (tok == "@") amt = val * 1.0;
    if (tok == "+") amt = amt + val*1.0;
    if (tok == "%") amt = amt + (amt * val/100.0);
     if (tok == "-") amt = amt - val*1.0;
    if (tok == "#") {             // record item number
      if (obj1.item_number) obj1.item_number.value = val;
      ary[j] = "";                // zap this array element
    }
// Now we do 3-character tokens...
    if (ary[j].length < 4) continue;
    tok = ary[j].substring (0,3); // first 3 chars
    val = ary[j].substring (3);   // get data
    if (tok == "s1=") {           // value for shipping
      if (obj1.shipping)  obj1.shipping.value  = val;
      ary[j] = "";                // clear it out
    }
    if (tok == "s2=") {           // value for shipping2
      if (obj1.shipping2) obj1.shipping2.value = val;
      ary[j] = "";                // clear it out
    }
  }
  val = ary.join (" ");           // rebuild val with what's left
}

function StorVal () {
var tag;
  tag = obj.name.substring (obj.name.length-2);  // get flag
  if      (tag == "1a") op1a = op1a + " " + val;
  else if (tag == "1b") op1b = op1b + " " + val;
  else if (tag == "2a") op2a = op2a + " " + val;
  else if (tag == "2b") op2b = op2b + " " + val;
  else if (tag == "3i") itmn = itmn + " " + val;
  else if (des.length == 0) des = val;
  else des = des + ", " + val;
}

function ReadForm (obj1, tst) { // Read the user form
var i,j,pos;
  amt=0;des="";op1a="";op1b="";op2a="";op2b="";itmn="";
  if (obj1.baseamt) amt  = obj1.baseamt.value*1.0;  // base amount
  for (i=0; i<obj1.length; i++) {     // run entire form
    obj = obj1.elements[i];           // a form element
    if (obj.type == "select-one") {   // just selects
      if (obj.name == "quantity" ||
          obj.name == "amount") continue;
      pos = obj.selectedIndex;        // which option selected
      val = obj.options[pos].value;   // selected value
      ChkTok (obj1);                  // check for any specials

      if (obj.name == "on0" ||        // let this go where it wants
          obj.name == "os0" ||
          obj.name == "on1" ||
          obj.name == "os1") continue;

      StorVal ();

    } else
    if (obj.type == "checkbox" ||     // just get checkboxex
        obj.type == "radio") {        //  and radios
      if (obj.checked) {
        val = obj.value;              // the value of the selection
        ChkTok (obj1);
        StorVal ();
      }
    } else
    if (obj.type == "select-multiple") {  //one or more
      for (j=0; j<obj.options.length; j++) {  // run all options
        if (obj.options[j].selected) {
          val = obj.options[j].value; // selected value (default)
          ChkTok (obj1);
          StorVal ();
        }
      }
    } else
    if ((obj.type == "text" ||        // just read text,
         obj.type == "textarea") &&
         obj.name != "tot" &&         //  but not from here
         obj.name != "quantity") {
      val = obj.value;                // get the data
      if (val == "" && tst) {         // force an entry
        alert ("Enter data for " + obj.name);
        return false;
      }
      StorVal ();
    }
  }
  if (op1a.length > 0) obj1.on0.value = op1a;
  if (op1b.length > 0) obj1.os0.value = op1b;
  if (op2a.length > 0) obj1.on1.value = op2a;
  if (op2b.length > 0) obj1.os1.value = op2b;
  if (itmn.length > 0) obj1.item_number.value = itmn;
  obj1.item_name.value = des;

  obj1.amount.value = Dollar (amt);
  if (obj1.amount.value == 0 && tst) {alert ("Please select at least one attendee.");
    return false;}

  if (obj1.tot) obj1.tot.value = "$" + Dollar (amt);

}
