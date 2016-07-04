sigma.parsers.json('sourceData3.json', {
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

var sourceData = "0,0,0,0,1,0\n0,0,1,0,0,0\n0,1,0,1,0,0\n0,0,1,0,1,0\n1,0,0,1,0,1\n0,0,0,0,1,0";
editor.setValue(sourceData);



var data;
var min = 0;
var max;
var max1;
var resData;
var a, c, path, v, q1, v0, k;
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

function checkHamilton() {

    
    var q1, k;

    //Матрица смежности

    var a = resData;

    var c = [a.length]; // номер хода, на котором посещается вершина
    var path = [a.length]; // номера посещаемых вершин
    var v0 = 2; // начальная вершина



    for (j=0; j<=a.length-1; j++) {
        for (i=0; i<=a[j].length-1; i++) {
            a[j][i] = Number(a[j][i]);
        }
    }

    //нахождениe гамильтонова цикла
    function gamilton(k) {
        var v, q1 = 0;
        for (v = 0; v < a.length && !q1; v++) {
            if (a[v][path[k - 1]] || a[path[k - 1]][v]) {
                if (k == a.length && v == v0) q1 = 1;
                else if (c[v] == -1) {
                    c[v] = k;
                    path[k] = v;
                    q1 = gamilton(k + 1);
                    if (!q1) c[v] = -1;

                } else continue;
            }
        }
        return q1;
    }

    for(j=0;j<a.length;j++) c[j]=-1;
    path[0]=v0;
    c[v0]=v0;

    
    
    var checkBtn = document.getElementById('check');
    var nxtBtn = document.getElementById('next');
    
    if (gamilton(1)) {
        console.log('Гамильтонов');
        sweetAlert({
            title: "Вы построили граф Гамильтона!",
            text: "Можете переходить к следующему заданию.",
            confirmButtonColor: "#45968f",
            confirmButtonText: "ОК",
        });
        nxtBtn.className = 'btn control-btn next-btn';
        
    } else {
        console.log('не Гамильтонов');
        sweetAlert({
            title: "Граф не является графом Гамильтона. ",
            text: "Попробуйте ещё раз.",
            confirmButtonColor: "#45968f",
            confirmButtonText: "ОК",
        });
    }
}
