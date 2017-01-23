
document.onload = function(){
	document.querySelector('.wrapper').style.opacity = '1';
}();
// замутить плавный фэйдин при загрузке страницы



function c_form({e,el,obj,xhr}) {

	xhr.onreadystatechange = function(){
		if(xhr.readyState == 4 || xhr.status == 200){
			console.log(xhr);
			el.innerHTML = xhr.responseText;
		}
	};

}

function c_submit({e,el,obj,xhr}) {

	var inps_obj = {};
	let inps = e.target.querySelectorAll('input[type=text]');

	Array.prototype.forEach.call(inps,function(a){
      if(!a.value) {
      	a.value = 'Enter valid data!';
      	throw new Error('Irregular data');
      }
      inps_obj[a.name] = a.value;
	});

	obj.data = inps_obj;

};

function c_list({e,obj,xhr,form}) {
	
  xhr.onreadystatechange = function(){
		if(xhr.readyState == 4 || xhr.status == 200){
			console.log(xhr);
			console.log(c_list_parser(xhr.responseText))
			form.innerHTML = c_list_parser(xhr.responseText);
		}
	};

};

function c_list_parser(obj){
	
	obj = JSON.parse(obj);

	var head   = `<tr><th>№</th><th>_Date_</th><th>Record</th><th>Price</th><th>Runout</th></tr>`;
	var body   = '';
	var Eprice = 0; 
	var Erun   = [];

	for (var i = 0; i < obj['date'].length; i++) {

	  var row  = '';		

		for (var k in obj) {
		  row += `<td>${obj[k][i]}</td>`;
		  if (k == 'price')  Eprice += +obj[k][i];
		  if (k == 'runout') Erun.push(obj[k][i]);
	    }

	    body += `<tr><td>${i+1}</td>${row}</tr>`;

	}

	var run = +Erun.pop() - +Erun.shift();
	
	var end = `<tr class='end'><th colspan='3'>Total</th><th>${Eprice}</th><th>${run}</th></tr>`;
	var t   = `<table>${head}${body}${end}</table>`;

	return t;
}


function formSubmit(e) {

	var body = {
    	name : "",
    	data : ""
    };
    body.name = e.target.ownerDocument.activeElement.name;

	var xhr = new XMLHttpRequest();
	xhr.open('POST',e.target.ownerDocument.activeElement.formAction,true);

	var prmtrs = {
		e    : e,
		el   : document.querySelector('.main'),
		obj  : body,
		xhr  : xhr,
		form : document.querySelector('#form')
	}

	var c_handlers = {
		'form'   : c_form,
		'submit' : c_submit,
		'list'   : c_list
	};

	e.preventDefault();

    c_handlers[e.target.ownerDocument.activeElement.name].call(formSubmit,prmtrs);

    xhr.send(JSON.stringify(body));

};

document.getElementById('form').onsubmit = formSubmit;

var main = document.querySelector('.main');

var observer = new MutationObserver(function(mutations){
	mutations.forEach(function(mutation){
	  if (mutation.type === 'childList'){
	  	mutation.target.children[0].children.form.onsubmit = formSubmit;
	  }
	})
})

observer.observe(main, {
  attributes: true, 
  childList: true, 
  characterData: true 
});

