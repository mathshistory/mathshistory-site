(function(){var P$=Clazz.newPackage("uk.ac.stand.mcs.wwwhistory.famouscurves"),I$=[[0,'java.awt.Color','java.util.Vector','java.awt.Font']],$I$=function(i){return I$[i]||(I$[i]=Clazz.load(I$[0][i]))};
var C$=Clazz.newClass(P$, "TextPanel", null, 'java.awt.Panel');
C$.defaultColour=null;

C$.$clinit$ = function() {Clazz.load(C$, 1);
C$.defaultColour=$I$(1).black;
}

Clazz.newMeth(C$, '$init0$', function () {
var c;if((c = C$.superclazz) && (c = c.$init0$))c.apply(this);
this.$height=0;
this.$width=0;
this.numberoflines=0;
this.lines=null;
this.colour=null;
this.fontsize=0;
this.fontname=null;
this.fontstyle=0;
this.centre=false;
}, 1);

Clazz.newMeth(C$, '$init$', function () {
this.fontsize=12;
this.fontname="Helvetica";
this.fontstyle=0;
this.centre=true;
}, 1);

Clazz.newMeth(C$, 'c$', function () {
Clazz.super_(C$, this,1);
this.resize$I$I(100, 50);
this.setBackground$java_awt_Color($I$(1).white);
this.numberoflines=1;
this.$height=this.size$().height;
this.$width=this.size$().width;
this.lines=Clazz.new_($I$(2).c$$I,[1]);
this.colour=C$.defaultColour;
this.repaint$();
}, 1);

Clazz.newMeth(C$, 'c$$S', function (line1) {
Clazz.super_(C$, this,1);
this.resize$I$I(100, 50);
this.setBackground$java_awt_Color($I$(1).white);
this.$height=this.size$().height;
this.$width=this.size$().width;
this.lines=Clazz.new_($I$(2).c$$I,[1]);
this.lines.addElement$TE(line1);
this.numberoflines=1;
this.colour=C$.defaultColour;
this.repaint$();
}, 1);

Clazz.newMeth(C$, 'c$$java_util_Vector', function (lines) {
Clazz.super_(C$, this,1);
this.resize$I$I(100, 50);
this.setBackground$java_awt_Color($I$(1).white);
this.$height=this.size$().height;
this.$width=this.size$().width;
this.lines=lines;
this.numberoflines=lines.size$();
this.colour=C$.defaultColour;
this.repaint$();
}, 1);

Clazz.newMeth(C$, 'setText$S', function (line1) {
var templines=Clazz.array(String, -1, [line1]);
this.lines=Clazz.new_($I$(2).c$$I,[1]);
this.lines.addElement$TE(line1);
this.numberoflines=1;
this.colour=C$.defaultColour;
this.repaint$();
});

Clazz.newMeth(C$, 'setText$java_util_Vector', function (lines) {
this.lines=lines;
this.numberoflines=lines.size$();
this.colour=C$.defaultColour;
this.repaint$();
});

Clazz.newMeth(C$, 'setFontSize$I', function (f) {
this.fontsize=f;
});

Clazz.newMeth(C$, 'setCentre$Z', function (centre) {
this.centre=centre;
});

Clazz.newMeth(C$, 'setColor$java_awt_Color', function (colour) {
this.colour=colour;
});

Clazz.newMeth(C$, 'paint$java_awt_Graphics', function (g) {
var textfits=false;
var tempfont=g.getFont$();
g.setFont$java_awt_Font(Clazz.new_($I$(3).c$$S$I$I,[this.fontname, this.fontstyle, this.fontsize]));
var fontmetrics=g.getFontMetrics$();
var lineheight=fontmetrics.getHeight$() - 1;
g.setColor$java_awt_Color($I$(1).white);
g.fillRect$I$I$I$I(0, 0, this.size$().width - 1, this.size$().height - 1);
g.setColor$java_awt_Color($I$(1).black);
g.drawRect$I$I$I$I(0, 0, this.size$().width - 1, this.size$().height - 1);
g.setColor$java_awt_Color(this.colour);
for (var i=0; i <= this.numberoflines - 1; i++) {
var lineposition=2;
if (this.centre) {
lineposition=(((this.size$().width - fontmetrics.stringWidth$S((this.lines.elementAt$I(i))))/2|0));
}g.drawString$S$I$I((this.lines.elementAt$I(i)), lineposition, 3 + (i + 1) * lineheight);
}
});
})();
;Clazz.setTVer('3.2.4.07');//Created 2019-08-02 17:21:01 Java2ScriptVisitor version 3.2.4.07 net.sf.j2s.core.jar version 3.2.4.07
