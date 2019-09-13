(function(){var P$=Clazz.newPackage("uk.ac.stand.mcs.wwwhistory.famouscurves"),I$=[[0,'java.awt.Color','java.awt.Dimension','java.awt.event.MouseAdapter','java.awt.Polygon']],$I$=function(i){return I$[i]||(I$[i]=Clazz.load(I$[0][i]))};
var C$=Clazz.newClass(P$, "PointButton", null, 'java.awt.Canvas');

C$.$clinit$ = function() {Clazz.load(C$, 1);
}

Clazz.newMeth(C$, '$init0$', function () {
var c;if((c = C$.superclazz) && (c = c.$init0$))c.apply(this);
this.direction=null;
this.texton=false;
this.text=null;
this.size=0;
this.fill=false;
this.textcolour=null;
this.preferredSize=null;
}, 1);

Clazz.newMeth(C$, '$init$', function () {
this.texton=false;
this.fill=false;
this.textcolour=$I$(1).red;
}, 1);

Clazz.newMeth(C$, 'c$$S', function (direction) {
C$.c$$S$I.apply(this, [direction, 20]);
}, 1);

Clazz.newMeth(C$, 'c$$S$I', function (direction, size) {
C$.c$$S$I$S.apply(this, [direction, size, null]);
}, 1);

Clazz.newMeth(C$, 'c$$S$I$S', function (direction, size, text) {
C$.c$$S$I$S$java_awt_Color.apply(this, [direction, size, text, null]);
}, 1);

Clazz.newMeth(C$, 'c$$S$I$S$java_awt_Color', function (direction, size, text, textcolour) {
Clazz.super_(C$, this,1);
this.direction=direction;
this.size=size;
this.text=text;
this.texton=text != null ;
if (textcolour != null ) {
this.textcolour=textcolour;
}if (direction.equals$O("North") || direction.equals$O("South") ) {
this.preferredSize=Clazz.new_($I$(2).c$$I$I,[size * 2 + 1, size + 1]);
} else if (direction.equals$O("Square")) {
this.preferredSize=Clazz.new_($I$(2).c$$I$I,[size * 2 + 1, size * 2 + 1]);
} else {
this.preferredSize=Clazz.new_($I$(2).c$$I$I,[size + 1, size * 2 + 1]);
}this.addMouseListener$java_awt_event_MouseListener(((P$.PointButton$1||
(function(){var C$=Clazz.newClass(P$, "PointButton$1", function(){Clazz.newInstance(this, arguments[0],1,C$);}, Clazz.load('java.awt.event.MouseAdapter'), null, 1);

C$.$clinit$ = function() {Clazz.load(C$, 1);
}

Clazz.newMeth(C$, '$init$', function () {
}, 1);

Clazz.newMeth(C$, 'mousePressed$java_awt_event_MouseEvent', function (e) {
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.PointButton'].fill=true;
this.b$['java.awt.Component'].repaint$.apply(this.b$['java.awt.Component'], []);
});

Clazz.newMeth(C$, 'mouseReleased$java_awt_event_MouseEvent', function (e) {
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.PointButton'].fill=false;
this.b$['java.awt.Component'].repaint$.apply(this.b$['java.awt.Component'], []);
});
})()
), Clazz.new_($I$(3), [this, null],P$.PointButton$1)));
}, 1);

Clazz.newMeth(C$, 'getDirection$', function () {
return this.direction;
});

Clazz.newMeth(C$, 'setDirection$S', function (direction) {
this.direction=direction;
});

Clazz.newMeth(C$, 'setSize$I', function (size) {
this.size=size;
if (this.direction.equals$O("North") || this.direction.equals$O("South") ) {
this.preferredSize=Clazz.new_($I$(2).c$$I$I,[size * 2 + 1, size + 1]);
} else if (this.direction.equals$O("Square")) {
this.preferredSize=Clazz.new_($I$(2).c$$I$I,[size * 2 + 1, size * 2 + 1]);
} else {
this.preferredSize=Clazz.new_($I$(2).c$$I$I,[size + 1, size * 2 + 1]);
}});

Clazz.newMeth(C$, 'setText$S', function (text) {
this.texton=true;
this.text=text;
});

Clazz.newMeth(C$, 'setTextColour$java_awt_Color', function (textcolour) {
this.textcolour=textcolour;
});

Clazz.newMeth(C$, 'mouseDown$I$I', function (mx, my) {
this.fill=true;
this.repaint$();
return true;
});

Clazz.newMeth(C$, 'mouseUp$I$I', function (mx, my) {
this.fill=false;
this.repaint$();
return true;
});

Clazz.newMeth(C$, 'mouseDrag$I$I', function (mx, my) {
if (this.inside$I$I(mx, my)) {
this.fill=true;
} else {
this.fill=false;
}this.repaint$();
return false;
});

Clazz.newMeth(C$, 'minimumSize$', function () {
return this.preferredSize;
});

Clazz.newMeth(C$, 'preferredSize$', function () {
return this.preferredSize;
});

Clazz.newMeth(C$, 'addNotify$', function () {
C$.superclazz.prototype.addNotify$.apply(this, []);
});

Clazz.newMeth(C$, 'flash$', function () {
this.fill=true;
this.repaint$();
this.fill=false;
this.repaint$();
});

Clazz.newMeth(C$, 'check$I$I', function (mx, my) {
});

Clazz.newMeth(C$, 'paint$java_awt_Graphics', function (g) {
var arrow=Clazz.new_($I$(4));
this.size--;
if (this.direction.equals$O("North")) {
arrow.addPoint$I$I(0, this.size);
arrow.addPoint$I$I(this.size * 2, this.size);
arrow.addPoint$I$I(this.size, 0);
arrow.addPoint$I$I(0, this.size);
} else if (this.direction.equals$O("South")) {
arrow.addPoint$I$I(0, 0);
arrow.addPoint$I$I(this.size * 2, 0);
arrow.addPoint$I$I(this.size, this.size);
arrow.addPoint$I$I(0, 0);
} else if (this.direction.equals$O("East")) {
arrow.addPoint$I$I(0, 0);
arrow.addPoint$I$I(0, this.size * 2);
arrow.addPoint$I$I(this.size, this.size);
arrow.addPoint$I$I(0, 0);
} else if (this.direction.equals$O("West")) {
arrow.addPoint$I$I(this.size, 0);
arrow.addPoint$I$I(this.size, this.size * 2);
arrow.addPoint$I$I(0, this.size);
arrow.addPoint$I$I(this.size, 0);
} else if (this.direction.equals$O("Square")) {
arrow.addPoint$I$I(0, 0);
arrow.addPoint$I$I(this.size * 2, 0);
arrow.addPoint$I$I(this.size * 2, this.size * 2);
arrow.addPoint$I$I(0, this.size * 2);
arrow.addPoint$I$I(0, 0);
}if (this.fill) {
g.setColor$java_awt_Color($I$(1).black);
} else {
g.setColor$java_awt_Color($I$(1).white);
}g.fillPolygon$java_awt_Polygon(arrow);
g.setColor$java_awt_Color($I$(1).black);
g.drawPolygon$java_awt_Polygon(arrow);
var width;
var height;
if (this.direction.equals$O("North") || this.direction.equals$O("South") ) {
width=this.size * 2;
height=this.size;
} else if (this.direction.equals$O("Square")) {
width=this.size * 2;
height=this.size * 2;
g.setColor$java_awt_Color($I$(1).darkGray);
g.drawLine$I$I$I$I(0, this.size, this.size * 2, this.size);
g.drawLine$I$I$I$I(this.size, 0, this.size, this.size * 2);
} else {
width=this.size;
height=this.size * 2;
}if (this.texton) {
g.setColor$java_awt_Color(this.textcolour);
g.drawString$S$I$I(this.text, (((width - g.getFontMetrics$().stringWidth$S(this.text))/2|0)), (((width - g.getFontMetrics$().getHeight$())/2|0)) + g.getFontMetrics$().getHeight$());
}this.size++;
});

Clazz.newMeth(C$, 'paramString$', function () {
return C$.superclazz.prototype.paramString$.apply(this, []) + ",direction=" + this.direction + ",size=" + this.size + ",text=" + this.text ;
});

Clazz.newMeth(C$);
})();
;Clazz.setTVer('3.2.4.07');//Created 2019-08-02 17:21:01 Java2ScriptVisitor version 3.2.4.07 net.sf.j2s.core.jar version 3.2.4.07
