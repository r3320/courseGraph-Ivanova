
sigma.parsers.json('sourceData2.json', {
    container: 'source-image',
    settings: {
        minEdgeSize: 0.1,
        maxEdgeSize: 2,
        sideMargin: 0.5,
        defaultNodeColor: "#1a7b72",
        defaultEdgeColor: "#1a7b72"
    }
});


var container = document.getElementById('editor');
var editor = ace.edit(container);
editor.setTheme("ace/theme/monokai");
editor.getSession().setMode('ace/mode/javascript');

var sourceData = "0,1,1,1,0\n1,0,1,1,1\n1,1,0,1,1\n1,0,1,0,1\n0,1,1,1,0";
editor.setValue(sourceData);



var data =0;
var min = 0;
var max;
var max1;
var resData =[];
var asd;

var counter;
var visited = [];
var e = [];

//var max = math.size(rightAnswer)[0];
//var max1 = math.size(rightAnswer)[1];

function createNodes(asd) {
    var x;
    var y;
    asd =[];
    for (var i = 0; i < max; i++) {
        
        if (i%3 === 0) {
            x = x+1;
            y = 1;
        }
        if (i%3 === 1) {
            x = x+1;
            y = 0;
        }
        if (i%3 === 2) {
            y = 2;
        }
        if (i === 0) {
            x = 0;
            y = 1;
        }
        if (i === 1) {
            x = 1;
            y = 0;
        }
        if (i === 2) {
            x = 1;
            y = 2;
        }
        asd[i] = {
            'id': 'n' + i,
            'label': 'x' + (i + 1),
            'x': x,
            'y': y,
            'size': 1
        };
        console.log(asd[i]);
    }
    return asd;

}

function createEdges(asd, resData) {

    var idNumber = 0;
    if (max != max1) {
        data = math.transpose(resData);
        //console.log(resData);
        for (var i = 0; i < max1; i++) {
            asd[idNumber] = {
                'id': 'e' + idNumber,
                'source': 'n' + data[i].indexOf(1),
                'target': 'n' + data[i].lastIndexOf(1)
            };
            //console.log(asd[idNumber]);
            idNumber += 1;
        }
    } else {
        for (var k = 0; k < max; k++) {
            for (var j = k; j < max1; j++) {
                if (resData[k][j] == 1) {
                    asd[idNumber] = {
                        'id': 'e' + idNumber,
                        'source': 'n' + k,
                        'target': 'n' + j
                    };
                    //console.log(asd[idNumber]);
                    idNumber += 1;
                }
            }
        }
    }
    return asd;
}

var dataToVisualize = {
    'nodes': [],
    'edges': []
};

function visualizeGraph() {
    data = 0;
    data = editor.getValue();
    data = data.split('\n');
    resData = [];
    for (var i = 0; i <= data.length - 1; i++) {
        //console.log(data[i]);
        resData[i] = data[i].split(',');
    }
    max = math.size(resData)[0];
    max1 = math.size(resData)[1];
    console.log(max, max1);
    //while(data[0]) {
    //resData.push(data.splice(0,5));
    //}
    $('#visualizator').empty();
    var s = new sigma({
        renderer: {
            container: document.getElementById('visualizator'),
            type: 'canvas'
        },
        settings: {
            minEdgeSize: 0.1,
            maxEdgeSize: 2,
            sideMargin: 0.5,
            defaultNodeColor: '#1a7b72',
            defaultEdgeColor: '#1a7b72'
        }
    });
    dataToVisualize['nodes'] = createNodes(dataToVisualize['nodes']);
    dataToVisualize['edges'].length = 0;
    dataToVisualize['edges'] = createEdges(dataToVisualize['edges'], resData);
    s.graph.read(dataToVisualize);
    s.refresh();
    console.log(resData);
    return (resData);

}

function dfs(v) {

    visited[v] = true;

    for (var i = 0; i < resData.length; ++i)
        if (resData[v][i] == 1 && !visited[i])
            dfs(i);
}

//считаем количество компонент связности
function connectedCompCount(resData) {
    //console.log(resData);
    for (var i = 0; i < resData.length; ++i)
        visited[i] = false;
    for (var i = 0; i < resData.length; ++i)
        if (!visited[i]) {
            counter++;
            dfs(i);
        }
    console.log(counter);
    return counter;
}

function checkEuler() {
    counter = 0
    console.log(resData);
    connectedCompCount(resData);

    for (var i = 0; i < resData.length; i++) {
        e[i] = 0;
        for (var j = 0; j < resData[i].length; j++) {
            if (resData[i][j] == "1") {
                e[i]++;
            }
        }
    }
    oddNode = 0;
    for (var i = 0; i < resData.length; i++) {
        if (e[i] % 2 == 1) {
            oddNode++;
        }
    }
    var checkBtn = document.getElementById('check');
    var nxtBtn = document.getElementById('next');
    if ((oddNode > 2) || (counter > 1)) {
        console.log(counter + ' не эйлеров');
        sweetAlert({
            title: "Граф не является графом Эйлера.",
            text: "Попробуйте ещё раз.",
            confirmButtonColor: "#45968f",
            confirmButtonText: "ОК",
        });
    } 
    if ((oddNode <= 2) && (counter = 1))
    {
        console.log(counter + ' эйлеров');
        sweetAlert({
            title: "Вы построили граф Эйлера!",
            text: "Можете переходить к следующему заданию.",
            confirmButtonColor: "#45968f",
            confirmButtonText: "ОК",
        });
        nxtBtn.className = 'btn control-btn next-btn';
    }
    if (resData.length<5) {
        sweetAlert('Неверно');
    }
}


//window.onload = function() {
//    vizualizeIt();
//}
