
   var elements = new Array();
   var elementIdMap = new Map();
   var elementTypeMap = new Map();
   var elementTextMap = new Map();
   var elementClickMap = new Map();
   var elementSendMap = new Map();
   var fileType = ".java";

function download(filename, text) {
     var element = document.createElement('a');
     element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
     element.setAttribute('download', filename);
     element.style.display = 'none';
     document.body.appendChild(element);
     element.click();
     document.body.removeChild(element);
}



function printPDF() {
  while(document.getElementsByClassName("btnSave text-center").length > 0){
		document.getElementsByClassName("btnSave text-center")[0].click()
  }
  var classeName = $('#name').val();
  var packagePath = $('#path').val()
  var line = $('#tblData').children().children();
  var page = new Object();
  page.classeName = classeName;
  page.packagePath = packagePath;
  console.log(page.classeName);
  var numeroLinhas = line.length - 1;
  for(var i = 1; i <= numeroLinhas; i++){
    var key = line[i].children[0].innerHTML;
    elements.push(key);
    elementIdMap[key] = line[i].children[1].innerHTML;
    elementTypeMap[key] = line[i].children[2].innerHTML;
    elementTextMap[key] = line[i].children[3].innerHTML;
    elementClickMap[key] = line[i].children[4].innerHTML;
    elementSendMap[key] = line[i].children[5].innerHTML;
  }
  page.elements = elements;
  page.elementIdMap = elementIdMap;
  page.elementTypeMap = elementTypeMap;
  page.elementTextMap = elementTextMap;
  page.elementClickMap = elementClickMap;
  page.elementSendMap = elementSendMap;
  page.elements.forEach(myFunction);

  var classe = PackageBuilder(page.packagePath);
  console.log(classe);
  classe += ImportsBuilder();
  console.log(classe);
  classe += StartClassBuilder(page.classeName);
  console.log(page.elementIdMap[elements[0]]);
  classe += FieldsBuilder(page);
  classe += AnnotationBuilder(page);
  classe += ConstructorBuilder(page.classeName);
  classe += TextBuilder(page);
  classe += ClickBuilder(page);
  classe += SendKeysBuilder(page);
  classe += EndClasseBuilder();
  download(page.classeName+fileType, classe);

}

function myFunction(value) {
  console.log(elementTypeMap[value]);
}

function Add(){
  $("#tblData tbody").append(
      "<tr>"+
      "<td class='text-center'><input type='text' class='text-center'/></td>"+
      "<td class='text-center'><input type='text' class='text-center'/></td>"+
      "<td class='text-center'><select>"+
      "<option value=\"ID\">ID</option>"+
      "<option value=\"XPATH\">XPATH</option>"+
      " <option value=\"CLASS_NAME\">CLASS NAME</option>"+
      "</select></td>"+
      "<td class='text-center'><input type=\"checkbox\" ></td>"+
      "<td class='text-center'><input  type=\"checkbox\" ></td>"+
      "<td class='text-center'><input type=\"checkbox\" ></td>"+
      "<td class='text-center'><img src='images/disk.png' class='btnSave text-center'><img src='images/delete.png' class='btnDelete'/></td>"+
      "</tr>");

      $(".btnSave").bind("click", Save);
      $(".btnDelete").bind("click", Delete);
};


function Save(){
    var par = $(this).parent().parent(); //tr
    var tdNomeDoElemento = par.children("td:nth-child(1)");
    var tdIdentificador = par.children("td:nth-child(2)");
    var tdTipo = par.children("td:nth-child(3)");
    var tdText = par.children("td:nth-child(4)");
    var tdCLick = par.children("td:nth-child(5)");
    var tdSendKey = par.children("td:nth-child(6)");
    var tdButtons = par.children("td:nth-child(7)");

    tdNomeDoElemento.html(tdNomeDoElemento.children("input[type=text]").val());
    tdIdentificador.html(tdIdentificador.children("input[type=text]").val());
    tdTipo.html(tdTipo.children("select").val());
    tdText.html(IsChecked(tdText.children("input[type=checkbox]")));
    tdCLick.html(IsChecked(tdCLick.children("input[type=checkbox]")));
    tdSendKey.html(IsChecked(tdSendKey.children("input[type=checkbox]")));
    tdButtons.html("<img src='images/delete.png' class='btnDelete'/>");


    $(".btnDelete").bind("click", Delete);
};


function IsChecked(Element){
  if(Element.prop("checked")){
    return "true";
  }else{
    return "false";
  }
};

function Delete(){
    var par = $(this).parent().parent(); //tr
    par.remove();
};

    $("#btnSub").bind("click", printPDF);
    $(".btnDelete").bind("click", Delete);
    $("#btnAdd").bind("click", Add);

function PackageBuilder(value){
  return "package " + value + ";\n\n";
};


function ImportsBuilder(){

  var value = new Array();

  var impo = "import ";
  value.push(impo + "org.openqa.selenium.support.FindBy;\n");
  value.push(impo + "org.openqa.selenium.support.CacheLookup;\n");
  value.push(impo + "org.openqa.selenium.support.How;\n");
  value.push(impo + "org.openqa.selenium.WebElement;\n");
  value.push(impo + "org.openqa.selenium.WebDriver;\n");

  console.log(value);

  return normalize(value);
}

function normalize(value) {

  var aux = "";

  var size = value.length;

  console.log(value[1]);

  console.log(size);

  for(var i = 0; i < size; i++){
    aux += value[i];
    console.log(aux);
  }

  aux += "\n\n";

  console.log(aux);

  return aux;
};

function StartClassBuilder(value){
  return  "public class " + value + "Page" + " {\n\n"
}


function FieldsBuilder(value){

  var aux = "    private WebDriver driver;\n\n";
  for(var i = 0; i < value.elements.length; i++){
     aux += "    private static final String " + value.elements[i].toUpperCase() + " = \"" + value.elementIdMap[value.elements[i]] + "\";\n\n";
  }

  console.log(aux);
  return aux;
}


function AnnotationBuilder(value){
  var aux = "";
  for(var i = 0; i < value.elements.length; i++){
    aux += "    @FindBy(how = How." + value.elementTypeMap[value.elements[i]] + ", using = \"" + value.elements[i].toUpperCase() + "\")\n" + "    @CacheLookup\n"
         + "    private WebElement " + camelize(value.elements[i]) + "WebElement" + ";\n\n" ;
  }

  console.log(aux);
  return aux;
};

function camelize(str) {
      return str.replace(/\W+(.)/g, function(match, chr)
       {
            return chr.toUpperCase();
        });
};

function ConstructorBuilder(className){

  var ttmm = "    public " + className + " (WebDriver driver){\n" + "        this.driver = driver;\n" + "    }\n\n";

	return ttmm;
}


function TextBuilder(value){
  var aux = "";
  for(var i = 0; i < value.elements.length; i++){

    if(value.elementTextMap[value.elements[i]] == "true"){
  	    aux += "    public String get" + titleize(value.elements[i]) + "(){\n"
  			    + "        return " + camelize(value.elements[i]) + "WebElement.getText();\n" + "    }\n\n";
    }
  }

  console.log(aux);
  return aux;
};


function ClickBuilder(value){
  var aux = "";
  for(var i = 0; i < value.elements.length; i++){

    if(value.elementClickMap[value.elements[i]] == "true"){
  	    aux += "    public void click" + titleize(value.elements[i]) + "(){\n"
  			    + "        return " + camelize(value.elements[i]) + "WebElement.click();\n" + "    }\n\n";
    }
  }

  console.log(aux);
  return aux;
};

function SendKeysBuilder(value){
  var aux = "";
  for(var i = 0; i < value.elements.length; i++){

    if(value.elementSendMap[value.elements[i]] == "true"){
  	    aux += "    public void sendKeys" + titleize(value.elements[i]) + "(String str){\n"
  			    + "        return " + camelize(value.elements[i]) + "WebElement..sendKeys(str);\n" + "    }\n\n";
    }
  }

  console.log(aux);
  return aux;
};



function titleize(text) {
    var words = text.toLowerCase().split(" ");
    for (var a = 0; a < words.length; a++) {
        var w = words[a];
        words[a] = w[0].toUpperCase() + w.slice(1);
    }
    return words.join(" ");
};


function EndClasseBuilder(){
  return " \n}";
}
