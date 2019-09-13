(function(){var P$=Clazz.newPackage("uk.ac.stand.mcs.wwwhistory.famouscurves"),I$=[[0,'java.awt.Color','java.awt.Font','uk.ac.stand.mcs.wwwhistory.famouscurves.Curve']],$I$=function(i){return I$[i]||(I$[i]=Clazz.load(I$[0][i]))};
var C$=Clazz.newClass(P$, "CurvePanel", null, 'java.awt.Panel');
C$.darkGreen=null;

C$.$clinit$ = function() {Clazz.load(C$, 1);
}

Clazz.newMeth(C$, '$init0$', function () {
var c;if((c = C$.superclazz) && (c = c.$init0$))c.apply(this);
this.pointstage=0;
this.pointX=0;
this.pointY=0;
this.circlestage=0;
this.circleX=0;
this.circleY=0;
this.circleCX=0;
this.circleCY=0;
this.circleR=0;
this.associatedcurveindex=0;
this.associatedcurve=null;
this.curve=null;
this.setaxis=false;
this.clear=false;
this.a=0;
this.b=0;
this.c=0;
this.d=0;
this.e=0;
this.f=0;
this.h=0;
this.k=0;
this.m=0;
this.n=0;
this.p=0;
this.steps=0;
}, 1);

Clazz.newMeth(C$, '$init$', function () {
this.steps=1;
}, 1);

Clazz.newMeth(C$, 'c$$uk_ac_stand_mcs_wwwhistory_famouscurves_Curve$I', function (curve, associatedcurveindex) {
Clazz.super_(C$, this,1);
this.setBackground$java_awt_Color($I$(1).white);
this.setaxis=false;
this.curve=curve;
var font=Clazz.new_($I$(2).c$$S$I$I,["Helvetica", 0, 12]);
this.setFont$java_awt_Font(font);
this.pointstage=0;
this.circlestage=0;
this.pointX=0;
this.pointY=0;
this.circleX=0;
this.circleY=0;
this.circleCX=0;
this.circleCY=0;
this.circleR=0;
this.associatedcurveindex=associatedcurveindex;
this.clear=false;
C$.darkGreen=Clazz.new_($I$(1).c$$I$I$I,[0, 140, 0]);
}, 1);

Clazz.newMeth(C$, 'c$$uk_ac_stand_mcs_wwwhistory_famouscurves_Curve', function (curve) {
Clazz.super_(C$, this,1);
this.setBackground$java_awt_Color($I$(1).white);
this.setaxis=false;
var xsc=((this.size$().width / (curve.xrange * (1)))|0);
var ysc=((this.size$().height / (curve.yrange * (1)))|0);
var sc=Math.min(xsc, ysc);
$I$(3).xsc=sc;
$I$(3).ysc=sc;
$I$(3).Ox=((curve.xb * $I$(3).xsc * (-1) )|0);
$I$(3).Oy=((curve.yt * $I$(3).xsc * (1) )|0);
$I$(3).xsize=this.size$().width;
$I$(3).ysize=this.size$().height;
this.curve=curve;
var font=Clazz.new_($I$(2).c$$S$I$I,["Helvetica", 0, 14]);
this.setFont$java_awt_Font(font);
this.pointstage=0;
this.circlestage=0;
this.pointX=0;
this.pointY=0;
this.circleX=0;
this.circleY=0;
this.circleCX=0;
this.circleCY=0;
this.circleR=0;
this.associatedcurveindex=0;
this.clear=false;
C$.darkGreen=Clazz.new_($I$(1).c$$I$I$I,[0, 140, 0]);
}, 1);

Clazz.newMeth(C$, 'recalculate$', function () {
switch (this.associatedcurveindex) {
case 0:
break;
case 1:
this.associatedcurve=this.curve.evolutePixels$();
break;
case 2:
this.associatedcurve=this.curve.involutePixels$I$I(this.pointX, this.pointY);
break;
case 3:
this.associatedcurve=this.curve.inversePixels$I$I$I$I(this.circleX, this.circleY, this.circleCX, this.circleCY);
break;
case 4:
this.associatedcurve=this.curve.pedalPixels$I$I(this.pointX, this.pointY);
break;
case 5:
this.associatedcurve=this.curve.negativePedalPixels$I$I(this.pointX, this.pointY);
break;
case 6:
this.associatedcurve=this.curve.causticPixels$I$I(this.pointX, this.pointY);
break;
case 7:
this.associatedcurve=this.curve.causticPixels$I$I$S(this.pointX, this.pointY,  String.instantialize("parallel"));
break;
}
this.pointX=$I$(3).xPointToPixel$D($I$(3).xPixelToPoint$I(this.pointX));
this.pointY=$I$(3).yPointToPixel$D($I$(3).yPixelToPoint$I(this.pointY));
this.circleX=$I$(3).xPointToPixel$D($I$(3).xPixelToPoint$I(this.circleX));
this.circleY=$I$(3).yPointToPixel$D($I$(3).yPixelToPoint$I(this.circleY));
this.circleCX=$I$(3).xPointToPixel$D($I$(3).xPixelToPoint$I(this.circleCX));
this.circleCY=$I$(3).yPointToPixel$D($I$(3).yPixelToPoint$I(this.circleCY));
this.circleR=((Math.sqrt((this.circleCX - this.circleX) * (this.circleCX - this.circleX) + (this.circleCY - this.circleY) * (this.circleCY - this.circleY)))|0);
});

Clazz.newMeth(C$, 'scale$D', function (f) {
this.pointX=$I$(3).xPointToPixel$D(f * $I$(3).xPixelToPoint$I(this.pointX));
this.pointY=$I$(3).yPointToPixel$D(f * $I$(3).yPixelToPoint$I(this.pointY));
this.circleX=$I$(3).xPointToPixel$D(f * $I$(3).xPixelToPoint$I(this.circleX));
this.circleY=$I$(3).yPointToPixel$D(f * $I$(3).yPixelToPoint$I(this.circleY));
this.circleCX=$I$(3).xPointToPixel$D(f * $I$(3).xPixelToPoint$I(this.circleCX));
this.circleCY=$I$(3).yPointToPixel$D(f * $I$(3).yPixelToPoint$I(this.circleCY));
this.circleR=((Math.sqrt((this.circleCX - this.circleX) * (this.circleCX - this.circleX) + (this.circleCY - this.circleY) * (this.circleCY - this.circleY)))|0);
});

Clazz.newMeth(C$, 'translate$I$I', function (xt, yt) {
this.pointX=this.pointX + xt;
this.pointY=this.pointY + yt;
this.circleX=this.circleX + xt;
this.circleY=this.circleY + yt;
this.circleCX=this.circleCX + xt;
this.circleCY=this.circleCY + yt;
this.recalculate$();
});

Clazz.newMeth(C$, 'setParameters$D$D$D$D$D$D$D$D$D$D$D', function (a, b, c, d, e, f, h, k, m, n, p) {
this.a=a;
this.b=b;
this.c=c;
this.d=d;
this.e=e;
this.f=f;
this.h=h;
this.k=k;
this.m=m;
this.n=n;
this.p=p;
});

Clazz.newMeth(C$, 'resetCurveParameters$', function () {
this.curve.a=this.a;
this.curve.b=this.b;
this.curve.c=this.c;
this.curve.d=this.d;
this.curve.e=this.e;
this.curve.f=this.f;
this.curve.h=this.h;
this.curve.k=this.k;
this.curve.m=this.m;
this.curve.n=this.n;
this.curve.p=this.p;
});

Clazz.newMeth(C$, 'mouseDown$java_awt_Event$I$I', function (e, mx, my) {
switch (this.associatedcurveindex) {
case 0:
break;
case 1:
break;
case 2:
this.pointX=mx;
this.pointY=my;
this.pointstage=1;
this.associatedcurve=this.curve.involutePixels$I$I(this.pointX, this.pointY);
this.repaint$();
break;
case 3:
var redraw=true;
var mR=Math.sqrt((mx - this.circleX) * (mx - this.circleX) + (my - this.circleY) * (my - this.circleY));
switch (this.circlestage) {
case 0:
this.circleX=mx;
this.circleY=my;
this.circleCX=mx;
this.circleCY=my;
this.circleR=2;
this.circlestage=1;
break;
case 1:
if (this.circleR - 1 < mR  && mR < this.circleR + 2  ) {
this.circleCX=mx;
this.circleCY=my;
this.circleR=((mR)|0);
this.circlestage=1;
redraw=false;
} else if (mR < 4 ) {
this.circleX=mx;
this.circleY=my;
this.circlestage=2;
redraw=false;
} else {
this.circleX=mx;
this.circleY=my;
this.circleCX=mx;
this.circleCY=my;
this.circleR=2;
this.circlestage=1;
}break;
case 2:
if (this.circleR - 2 < mR  && mR < this.circleR + 3  ) {
this.circleCX=mx;
this.circleCY=my;
this.circleR=((mR)|0);
this.circlestage=1;
redraw=false;
} else if (mR < 3 ) {
this.circleX=mx;
this.circleY=my;
this.circlestage=2;
redraw=false;
} else {
this.circleX=mx;
this.circleY=my;
this.circleCX=mx;
this.circleCY=my;
this.circleR=2;
this.circlestage=1;
}break;
}
this.associatedcurve=this.curve.inversePixels$I$I$I$I(this.circleX, this.circleY, this.circleCX, this.circleCY);
if (redraw) {
this.repaint$();
}break;
case 4:
this.pointX=mx;
this.pointY=my;
this.pointstage=1;
this.associatedcurve=this.curve.pedalPixels$I$I(this.pointX, this.pointY);
this.repaint$();
break;
case 5:
this.pointX=mx;
this.pointY=my;
this.pointstage=1;
this.associatedcurve=this.curve.negativePedalPixels$I$I(this.pointX, this.pointY);
this.repaint$();
break;
case 6:
this.pointX=mx;
this.pointY=my;
this.pointstage=1;
this.associatedcurve=this.curve.causticPixels$I$I(this.pointX, this.pointY);
this.repaint$();
break;
case 7:
this.pointX=mx;
this.pointY=my;
this.pointstage=1;
this.associatedcurve=this.curve.causticPixels$I$I$S(this.pointX, this.pointY,  String.instantialize("parallel"));
this.repaint$();
break;
}
return true;
});

Clazz.newMeth(C$, 'mouseDrag$java_awt_Event$I$I', function (e, mx, my) {
switch (this.associatedcurveindex) {
case 0:
break;
case 1:
break;
case 2:
this.pointX=mx;
this.pointY=my;
this.pointstage=1;
this.associatedcurve=this.curve.involutePixels$I$I(this.pointX, this.pointY);
this.repaint$();
break;
case 3:
switch (this.circlestage) {
case 0:
this.circleX=mx;
this.circleY=my;
this.circleCX=mx;
this.circleCY=my;
this.circleR=2;
this.circlestage=1;
break;
case 1:
var mR=Math.sqrt((mx - this.circleX) * (mx - this.circleX) + (my - this.circleY) * (my - this.circleY));
this.circleCX=mx;
this.circleCY=my;
this.circleR=Math.max(2, ((mR)|0));
this.circlestage=1;
break;
case 2:
this.circleX=mx;
this.circleY=my;
this.circleCX=mx + this.circleR;
this.circleCY=my;
this.circlestage=2;
break;
}
this.associatedcurve=this.curve.inversePixels$I$I$I$I(this.circleX, this.circleY, this.circleCX, this.circleCY);
this.repaint$();
break;
case 4:
this.pointX=mx;
this.pointY=my;
this.pointstage=1;
this.associatedcurve=this.curve.pedalPixels$I$I(this.pointX, this.pointY);
this.repaint$();
break;
case 5:
this.pointX=mx;
this.pointY=my;
this.pointstage=1;
this.associatedcurve=this.curve.negativePedalPixels$I$I(this.pointX, this.pointY);
this.repaint$();
break;
case 6:
this.pointX=mx;
this.pointY=my;
this.pointstage=1;
this.associatedcurve=this.curve.causticPixels$I$I(this.pointX, this.pointY);
this.repaint$();
break;
case 7:
this.pointX=mx;
this.pointY=my;
this.pointstage=1;
this.associatedcurve=this.curve.causticPixels$I$I$S(this.pointX, this.pointY,  String.instantialize("parallel"));
this.repaint$();
break;
}
return true;
});

Clazz.newMeth(C$, 'paint$java_awt_Graphics', function (g) {
if (!this.setaxis) {
var sc;
sc=((this.size$().height / (this.curve.yrange))|0);
$I$(3).xsc=sc;
$I$(3).ysc=sc;
$I$(3).Ox=((-this.curve.xb * sc + ((this.size$().width - this.size$().height)/2|0))|0);
$I$(3).Oy=((+this.curve.yt * sc)|0);
$I$(3).xsize=this.size$().width;
$I$(3).ysize=this.size$().height;
this.curve.setCurve$();
this.curve.translate$I$I(0, 0);
this.translate$I$I(0, 0);
this.setaxis=true;
}if (this.clear || true ) {
g.setColor$java_awt_Color($I$(1).white);
g.fillRect$I$I$I$I(0, 0, this.size$().width, this.size$().height);
this.clear=false;
}g.setColor$java_awt_Color($I$(1).lightGray);
g.drawLine$I$I$I$I($I$(3).Ox, 0, $I$(3).Ox, this.size$().height);
g.drawLine$I$I$I$I(0, $I$(3).Oy, this.size$().width, $I$(3).Oy);
g.setColor$java_awt_Color($I$(1).blue);
var acx1;
var acy1;
var acx2;
var acy2;
var acx0;
var acy0;
var j=0;
for (var i=0; i <= this.curve.nop - this.steps; i+=this.steps) {
acx1=this.curve.fxpixels[i];
acy1=this.curve.fypixels[i];
acx2=this.curve.fxpixels[i + this.steps];
acy2=this.curve.fypixels[i + this.steps];
if ((0 < acx2 && acx2 < $I$(3).xsize  && 0 < acy2  && acy2 < $I$(3).ysize ) || (0 < acx1 && acx1 < $I$(3).xsize  && 0 < acy1  && acy1 < $I$(3).ysize ) ) {
if (Math.abs(acx1 - acx2) < (this.size$().height/2|0) && Math.abs(acy1 - acy2) < (this.size$().width/2|0) ) {
g.drawLine$I$I$I$I(acx1, acy1, acx2, acy2);
}}j=i;
}
if (j != this.curve.nop - 1) {
j++;
acx1=this.curve.fxpixels[j];
acy1=this.curve.fypixels[j];
acx2=this.curve.fxpixels[this.curve.fxpixels.length - 1];
acy2=this.curve.fypixels[this.curve.fxpixels.length - 1];
if ((0 < acx2 && acx2 < $I$(3).xsize  && 0 < acy2  && acy2 < $I$(3).ysize ) || (0 < acx1 && acx1 < $I$(3).xsize  && 0 < acy1  && acy1 < $I$(3).ysize ) ) {
if (Math.abs(acx1 - acx2) < (this.size$().height/2|0) && Math.abs(acy1 - acy2) < (this.size$().width/2|0) ) {
g.drawLine$I$I$I$I(acx1, acy1, acx2, acy2);
}}}g.setColor$java_awt_Color($I$(1).green);
if (this.pointstage > 0) {
g.fillArc$I$I$I$I$I$I(this.pointX - 2, this.pointY - 2, 4, 4, 0, 360);
}if (this.circlestage > 0) {
g.fillArc$I$I$I$I$I$I(this.circleX - 2, this.circleY - 2, 4, 4, 0, 360);
g.setColor$java_awt_Color(C$.darkGreen);
g.drawArc$I$I$I$I$I$I(this.circleX - this.circleR, this.circleY - this.circleR, 2 * this.circleR, 2 * this.circleR, 0, 360);
}if (this.associatedcurveindex == 7 && this.pointstage > 0 ) {
g.setColor$java_awt_Color(C$.darkGreen);
if (this.pointX == $I$(3).Ox) {
if (this.pointY == $I$(3).Oy) {
g.drawLine$I$I$I$I(0, $I$(3).Oy, this.size$().width, $I$(3).Oy);
} else {
g.drawLine$I$I$I$I($I$(3).Ox, 0, $I$(3).Ox, this.size$().height);
}} else {
var linepoints=$I$(3).lineEnds$D$D($I$(3).yPixelToPoint$I(this.pointY) / $I$(3).xPixelToPoint$I(this.pointX), 0.0);
g.drawLine$I$I$I$I(linepoints[0][0], linepoints[1][0], linepoints[0][1], linepoints[1][1]);
}}g.setColor$java_awt_Color($I$(1).red);
if ((this.associatedcurveindex > 0 && this.pointstage + this.circlestage > 0 ) || (this.associatedcurveindex == 1) ) {
for (var i=0; i <= this.curve.nop + 2 - this.steps; i+=this.steps) {
acx1=this.associatedcurve[0][i];
acy1=this.associatedcurve[1][i];
acx2=this.associatedcurve[0][i + this.steps];
acy2=this.associatedcurve[1][i + this.steps];
if ((0 < acx2 && acx2 < $I$(3).xsize  && 0 < acy2  && acy2 < $I$(3).ysize ) || (0 < acx1 && acx1 < $I$(3).xsize  && 0 < acy1  && acy1 < $I$(3).ysize ) ) {
if (Math.abs(acx1 - acx2) < (this.size$().height/2|0) && Math.abs(acy1 - acy2) < (this.size$().width/2|0) ) {
g.drawLine$I$I$I$I(acx1, acy1, acx2, acy2);
}}j=i;
}
if (j != this.curve.nop - 1) {
j++;
acx1=this.associatedcurve[0][j];
acy1=this.associatedcurve[1][j];
acx2=this.associatedcurve[0][this.associatedcurve[0].length - 1];
acy2=this.associatedcurve[1][this.associatedcurve[1].length - 1];
if ((0 < acx2 && acx2 < $I$(3).xsize  && 0 < acy2  && acy2 < $I$(3).ysize ) || (0 < acx1 && acx1 < $I$(3).xsize  && 0 < acy1  && acy1 < $I$(3).ysize ) ) {
if (Math.abs(acx1 - acx2) < (this.size$().height/2|0) && Math.abs(acy1 - acy2) < (this.size$().width/2|0) ) {
g.drawLine$I$I$I$I(acx1, acy1, acx2, acy2);
}}}}g.setColor$java_awt_Color(C$.darkGreen);
if (this.pointstage > 0 && this.associatedcurveindex != 7 ) {
g.drawArc$I$I$I$I$I$I(this.pointX - 2, this.pointY - 2, 4, 4, 0, 360);
}if (this.circlestage > 0) {
g.drawArc$I$I$I$I$I$I(this.circleX - 2, this.circleY - 2, 4, 4, 0, 360);
}});

Clazz.newMeth(C$);
})();
;Clazz.setTVer('3.2.4.07');//Created 2019-08-02 17:21:01 Java2ScriptVisitor version 3.2.4.07 net.sf.j2s.core.jar version 3.2.4.07
