/**
 * JSFunctions.js
 * 
 * @author  ( Mani	     )
 * @version ( 15/05/2015 )
 */
 
 function crearID(apPat,apMat,nombre){
	 var strName, strApPat, strApMat, strID;
	 
	 // Obtener valores
	 document.getElementsByName("username")[0].style.textTransform="uppercase";
	 strApPat = document.getElementsByName(apPat)[0].value.toUpperCase();
	 strApMat = document.getElementsByName(apMat)[0].value.toUpperCase();
	 strName  = document.getElementsByName(nombre)[0].value.toUpperCase();
	 strID    = strApPat.substr((strApPat.length)-3,strApPat.length)+
				strApMat.substr((strApMat.length)-3,strApMat.length)+
				strName.substr((strName.length)-3,strName.length);
	 
	 //Mostrar ID
	 //document.getElementsByName(destino)[0].value=strID;
	 alert(strID);
 }
 
 function upperCase(nombre){
	 document.getElementsByName(nombre)[0].style.textTransform="uppercase";
 }