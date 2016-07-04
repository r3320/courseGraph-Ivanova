/**
var data = {
    "nodes": [{
            "id": "n0",
            "label": "x1",
            "x": 0,
            "y": 0,
            "size": 5
    }, {
            "id": "n1",
            "label": "x2",
            "x": 0,
            "y": 1,
            "size": 5
    }, {
            "id": "n2",
            "label": "x3",
            "x": 1,
            "y": 0,
            "size": 5
    },
        {
            "id": "n3",
            "label": "x4",
            "x": 1,
            "y": 1,
            "size": 5
              },
        {
            "id": "n4",
            "label": "x4",
            "x": 2,
            "y": 0,
            "size": 5
              }],
    "edges": [{
            "id": "e0",
            "source": "n0",
            "target": "n1"
    }, {
            "id": "e1",
            "source": "n0",
            "target": "n2"
    }, {
            "id": "e2",
            "source": "n1",
            "target": "n3"
    },
        {
            "id": "e3",
            "source": "n1",
            "target": "n2"
              }]
}
*/

sigma.parsers.json('sourceData1.json', {
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

var sourceData = "0,1,1,0,0\n1,0,1,1,0\n1,1,0,0,0\n0,1,0,0,0\n0,0,0,0,0";
editor.setValue('Введите матрицу смежности сюда');
//editor.setValue(sourceData);


var data;
var min = 0;
var max;
var max1;
var asd;


var rightAnswer = [
    ["0", "1", "1", "0", "0"],
    ["1", "0", "1", "1", "0"],
    ["1", "1", "0", "0", "0"],
    ["0", "1", "0", "0", "0"],
    ["0", "0", "0", "0", "0"]
];

//var max = math.size(rightAnswer)[0];
//var max1 = math.size(rightAnswer)[1];

function createNodes(asd) {
    asd =[];
    for (var i = 0; i < max; i++) {
        var x;
        var y;
        
        if (i % 2 === 0) {
            x = x + 1;
            y = 0;
        } else {
            x = x;
            y = 1;
        }
        if (i === 0) {
            x = 0;
            y = 0;
        }
        asd[i] = {
            'id': 'n' + i,
            'label': 'x' + (i + 1),
            'x': x,
            'y': y,
            'size': 1
        };
        //console.log(asd[i]);
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
    data = editor.getValue();
    data = data.split('\n');
    resData = [];
    for (var i = 0; i <= data.length - 1; i++) {
        //console.log(data[i]);
        resData[i] = data[i].split(',');
    }
    max = math.size(resData)[0];
    max1 = math.size(resData)[1];
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
    //console.log('right' + rightAnswer);
    //console.log('ответ' + resData);
    return (resData);
}

function checkIt() {
    var expect = chai.expect;

    try {
        var checkBtn = document.getElementById('check');
        var nxtBtn = document.getElementById('next');
        if (expect(rightAnswer).to.eql(resData)) {
            console.log('right');
            //checkBtn.innerHTML = 'Верно';
            //checkBtn.className = 'btn control-btn check-btn right';
            nxtBtn.className = 'btn control-btn next-btn';
            sweetAlert({
                title: "Верно!",
                text: "Можете переходить к следующему заданию",
                confirmButtonColor: "#45968f",
                confirmButtonText: "ОК",
            });
        }
    } catch (err) {
        console.log('wrong!');
        checkBtn.className = 'btn control-btn check-btn';
        checkBtn.innerHTML = 'Проверить';
        nxtBtn.className = 'btn control-btn next-btn disabled'
        sweetAlert('Неверно!');
    }
}
//window.onload = function() {
//    vizualizeIt();
//}
