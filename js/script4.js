sigma.parsers.json('sourceData4.json', {
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

var sourceData = "0,1,1,1,1,1\n1,0,1,1,0,1\n1,1,0,1,0,1\n1,1,1,0,1,1\n1,0,0,1,0,1\n1,1,1,1,1,0";
editor.setValue(sourceData);

var data;
var min = 0;
var max;
var max1;
var resData;
var finalCount = 0;
var asd;

function createNodes(asd) {
    var x;
    var y;
    asd =[];
    for (var i = 0; i < max; i++) {

        if (i == 0) {
            x = 6;
            y = 0;
        }
        if (i == 1) {
            x = 2;
            y = 4;
        }
        if (i == 2) {
            x = 4;
            y = 8;
        }
        if (i == 3) {
            x = 8;
            y = 8;
        }
        if (i == 4) {
            x = 10;
            y = 4;
        }
        if (i == 5) {
            x = 6;
            y = 5;
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

function visualizeIt() {
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

function treeCheck() {

    var ec;

    function IsConnected() {
        var VertexState = [resData.length];
        var red = false;
        var k = 0;
        for (var i = 0; i < resData.length; i++) {
            VertexState[i] = 1; // все черные
        }
        VertexState[0] = 2; // красная

        do {
            red = true;
            for (var i = 0; i < resData.length; i++) {
                if (VertexState[i] == 2) {
                    VertexState[i] = 3;
                    k = i;
                    break;
                }
            }

            for (var i = 0; i < resData.length; i++) {

                if (resData[k][i] == 1 && VertexState[i] == 1) {
                    VertexState[i] = 2;
                }
            }

            for (var i = 0; i < resData.length; i++) {
                if (VertexState[i] == 2)
                    red = false;
            }

        } while (red === false);

        for (var i = 0; i < resData.length; i++)
            if (VertexState[i] == 1)
                finalCount++;

        // Если finalCount = 0, то граф связный
        console.log(finalCount);
        return (finalCount)
    }

    var nodesCount = resData.length;
    edgesCount = function () {
        console.log(resData);
        var counter = 0;
        for (i = 0; i <= resData.length - 1; i++) {
            for (j = 0; j <= resData[i].length; j++) {
                if (resData[i][j] == 1) {
                    counter++;
                }
            }
        }
        ec = counter / 2;
        return (ec);
    }

    IsConnected();
    edgesCount();

    var checkBtn = document.getElementById('check');
    var nxtBtn = document.getElementById('next');

    if (((finalCount === 0) && (ec == 5))) {
        console.log('tree');
        sweetAlert({
            title: "Вы построили остовное дерево графа!",
            confirmButtonColor: "#45968f",
            confirmButtonText: "ОК"
        });

    } else {
        console.log('wrong');
        sweetAlert({
                title: "Вы неверно построили остовное дерево графа.",
                text: "Попробуйте ещё раз"
        })

    }
}
