function appendToDisplay(value) {
    var display = document.getElementById('display');
    if (display.innerText === 'Digite a expressão') {
      display.innerText = value;
    } else {
      display.innerText += value;
    }
  }

  function clearDisplay() {
    document.getElementById('display').innerText = 'Digite a expressão';
    document.getElementById('truth-table').innerHTML = '';
    document.getElementById('tipo_Preposicao').innerText = '?';
  }

  function deleteLastChar() {
    var display = document.getElementById('display');
    var texto = display.innerText;

    if(texto !== 'Digite a expressão'){
      if(texto.charAt(texto.length-7) == "[" && texto.charAt(texto.length-1) == "]"){
        for(let f=0; f<7; f++){ texto = texto.slice(0, -1);}
        if(texto == ''){ texto = 'Digite a expressão'; }
        }
      else if(texto.charAt(texto.length-12) == "[" && texto.charAt(texto.length-1) == "]"){
        for(let f=0; f<12; f++){ texto = texto.slice(0, -1); }
        if(texto == ''){ texto = 'Digite a expressão'; }
      }else{
        texto = texto.slice(0, -1);
        if(texto == ''){ texto = 'Digite a expressão'; }
      }
    }

    document.getElementById('tipo_Preposicao').innerText = '?';
    document.getElementById('truth-table').innerHTML = '';
    display.innerText = texto;
    }      
  

   function expression_String_Booleano(expression){
    //Converte "[Verdadeiro]" para "1" e "[Falso]" para "0";
    let acumulador = "";
    let cochete = false;
    let contador = 0;
    for(let i = 0; i < expression.length; i++){
      if(expression.charAt(i) == "["){
        cochete = true;
        contador = 0;
      }else if(expression.charAt(i) == "]"){
        cochete = false;
        if(contador == 5){acumulador = acumulador + "0";}
        else{acumulador = acumulador + "1";}
      }else{
        contador++;
        if(cochete == false){
          acumulador = acumulador + expression.charAt(i); 
        }
      }}
    
    return acumulador; 
  }

  function expression_Booleano_String(expression){
    //Converte "[Verdadeiro]" para "1" e "[Falso]" para "0";
    let acumulador = "";
    let cochete = false;
    let contador = 0;
    for(let i = 0; i < expression.length; i++){
      if(expression.charAt(i) == "["){
        cochete = true;
        contador = 0;
      }else if(expression.charAt(i) == "]"){
        cochete = false;
        if(contador == 5){acumulador = acumulador + "0";}
        else{acumulador = acumulador + "1";}
      }else{
        contador++;
        if(cochete == false){
          acumulador = acumulador + expression.charAt(i); 
        }
      }}
    
    return acumulador; 
  }

  function variables_Booleano_String(variables){
  // ['A','B','1']  -------->  ['A','B','[Verdadeiro]']
    for(let i = 0; i < variables.length; i++){
      if(variables[i] == '1'){
        variables[i] = "[Verdadeiro]"
      }else if(variables[i] == '0'){
        variables[i] = "[Falso]"
      }else{
      
      }}
    
    return variables; 
  }


  //################################################################
  function calculate() {

    var display = document.getElementById('display');
    var expression = display.innerText; //Expressão proposicional
    
    //Evita que seja calculada a expressão errada, exemplo;  A v [Verdadeiro][Falso] 
    for(let i = 0; i < expression.length; i++){
      if(expression.charAt(i) == "]" && expression.charAt(i+1) == "["){
        return;
      }
    }

    //"AvB[Verdadeiro]"
    titulo_coluna_resultado = expression;

    //           "AvB[Verdadeiro]"   --------> "AvB1"
    expression = expression_String_Booleano(expression);

    //Armazena um array com as proposições ['A','B','1']
    var variables = Array.from(new Set(expression.match(/[A-Za-z0-9]/g)||[]));  
    variables_boolean = variables;

    //Array com todas as combinações de true e false, sem ser o resultado final
    //[[false,false], [false,true], [true,false], [true,true]]
    const combinations = generateCombinations(variables);

    // ['A','B','1']  -------->  ['A','B','[Verdadeiro]']
    variables = variables_Booleano_String(variables);

    // Gerar a tabela-verdade
    let tableHtml = `<table><thead><tr>${variables.map(v => `<th>${v}</th>`).join('')}<th>${titulo_coluna_resultado}</th></tr></thead><tbody>`;

    var vetor_resultados = [];
    var count_result = 0;
    combinations.forEach(combination => {
      const values = {};

      variables_boolean.forEach((varName, index) => {
        values[varName] = combination[index];
      });
      
      //{A: false, B: false, [Verdadeiro]: true}
      const result = evaluatePropositionalLogic(expression, values);
      tableHtml += `<tr>${variables_boolean.map(v => `<td>${values[v] ? 'V' : 'F'}</td>`).join('')}<td>${result ? 'V' : 'F'}</td></tr>`;
      
      //Vetor Booleano com os resultados da tabela-verdade   
      vetor_resultados[count_result] =  result;
      count_result++;
    });
    
    tableHtml += `</tbody></table>`;
    console.log(tableHtml);
    // Exibir a tabela-verdade
    document.getElementById('truth-table').innerHTML = tableHtml;
    tipo_Da_Proposicao(vetor_resultados);
  }
  //################################################################


  function generateCombinations(variables) {
    var total_de_Linhas = 0;
    var cont_VF = 0; 
    var total_de_Colunas = 0;

    for(let i=0; i < variables.length; i++){
      if(variables[i] == "1" || variables[i] == "0"){ cont_VF++; }
    }

    total_de_Linhas = Math.pow(2, variables.length - cont_VF);
    total_de_Colunas = variables.length - cont_VF;

    const combinations = [];

    for (let i = 0; i < total_de_Linhas; i++) {
      const combination = [];
      for (let j = 0; j < total_de_Colunas; j++) {
        combination.push(Boolean(i & ( Math.pow(2, variables.length-cont_VF-1)>> j)));
      }
      for(let k = 0; k < variables.length ; k++){
          if(variables[k] == "1"){ combination.splice(k, 0, true); }
          if(variables[k] == "0"){ combination.splice(k, 0, false); }
        }
      combinations.push(combination);
      
    }
    console.log(combinations);
   
    return combinations;
    //[[false,false], [false,true], [true,false], [true,true]]
  }

  //                                (A→B , {A: false, B: false} )
  function evaluatePropositionalLogic(expression, values) {
    
   // Operações lógicas
   // Condicional---------------------------------
   var acc = ""; 
   let Logica_OR = ")||";
   let Logica_NOT = "!(";
    
   for (let i = 0; i < expression.length; i++) {
    if(expression.charAt(i) == "→"){
      acc = Logica_NOT + acc + Logica_OR;
    }else{
      acc = acc + expression.charAt(i);
    }}
    
    expression = acc;                             // Condicional
    expression = expression.replace(/∼/g, '!');  // Negação
    expression = expression.replace(/∧/g, '&&'); // Conjunção (AND)
    expression = expression.replace(/∨/g, '||'); // Disjunção (OR)
    expression = expression.replace(/↔/g, '=='); // Bi-condicional
    expression = expression.replace(/⊻/g, '!=='); // Disjunção-exclusiva
    console.log(expression);
    // Substituir variáveis proposicionais pelos valores passados se for true ou false
    expression = expression.replace(/[A-Z]/g, match => values[match] !== undefined ? values[match] : false);

    expression = expression.replace(/1/g, 'true');
    expression = expression.replace(/0/g, 'false');
    //A→B→C
    //A
    //!(A)||
    //!(A)||B
    //!(!(A)||B)
    //!(!(A)||B)C
    console.log(expression);
    return new Function('return ' + expression)();
  }

   function tipo_Da_Proposicao(vetor_resultados){
    total = vetor_resultados.length;
    let qtd_verdadeiros = 0;
    let qtd_falsos = 0;

    for(let i=0; i < vetor_resultados.length ;i++){
        if(vetor_resultados[i] == true){qtd_verdadeiros++;}
        else{qtd_falsos++;}        
    }

    if(qtd_verdadeiros == total){document.getElementById('tipo_Preposicao').innerText = 'Taltologia';}

    else if(qtd_falsos == total){document.getElementById('tipo_Preposicao').innerText = 'Contradição';}

    else{document.getElementById('tipo_Preposicao').innerText = 'Contigência';}

    console.log("------começo----");
    console.log(vetor_resultados);
    console.log("------fim----");
   }