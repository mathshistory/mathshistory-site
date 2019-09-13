(function(){var P$=Clazz.newPackage("uk.ac.stand.mcs.wwwhistory.famouscurves"),I$=[[0,'uk.ac.stand.mcs.wwwhistory.famouscurves.Curve','java.awt.BorderLayout','uk.ac.stand.mcs.wwwhistory.famouscurves.CurvePanel','uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls']],$I$=function(i){return I$[i]||(I$[i]=Clazz.load(I$[0][i]))};
var C$=Clazz.newClass(P$, "FamousCurves", null, 'java.applet.Applet');

C$.$clinit$ = function() {Clazz.load(C$, 1);
}

Clazz.newMeth(C$, '$init0$', function () {
var c;if((c = C$.superclazz) && (c = c.$init0$))c.apply(this);
this.curve=null;
this.curvepanel=null;
this.curvecontrols=null;
this.curvename=null;
this.tmin=0;
this.tmax=0;
this.numberofpoints=0;
this.td=0;
this.numberofpointsb=false;
this.tdb=false;
this.dt=0;
this.xb=0;
this.xt=0;
this.yb=0;
this.yt=0;
this.supportedparameters=null;
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
this.ap=false;
this.bp=false;
this.cp=false;
this.dp=false;
this.ep=false;
this.fp=false;
this.hp=false;
this.kp=false;
this.mp=false;
this.np=false;
this.pp=false;
}, 1);

Clazz.newMeth(C$, '$init$', function () {
this.numberofpointsb=false;
this.tdb=false;
this.ap=false;
this.bp=false;
this.cp=false;
this.dp=false;
this.ep=false;
this.fp=false;
this.hp=false;
this.kp=false;
this.mp=false;
this.np=false;
this.pp=false;
}, 1);

Clazz.newMeth(C$, ['init$','init'], function () {
this.curvename="Ellipse";
this.tmin=0.0;
this.tmax=6.824;
this.numberofpoints=200;
this.td=0.03142;
this.dt=1.0E-6;
this.xb=-5;
this.xt=5;
this.yb=-5;
this.yt=5;
this.supportedparameters="";
this.a=1.0;
this.b=0.5;
this.c=3.0;
this.d=-4.0;
this.e=1;
this.f=-1;
this.h=2;
this.k=2;
this.m=5;
this.n=3;
this.p=0;
var curvenamestring=this.getParameter$S("curvename");
var tminstring=this.getParameter$S("tmin");
var tmaxstring=this.getParameter$S("tmax");
var numberofpointsstring=this.getParameter$S("numberofpoints");
var tdstring=this.getParameter$S("td");
var dtstring=this.getParameter$S("dt");
var xbstring=this.getParameter$S("xb");
var xtstring=this.getParameter$S("xt");
var ybstring=this.getParameter$S("yb");
var ytstring=this.getParameter$S("yt");
var supportedparametersstring=this.getParameter$S("supportedparameters");
var astring=this.getParameter$S("a");
var bstring=this.getParameter$S("b");
var cstring=this.getParameter$S("c");
var dstring=this.getParameter$S("d");
var estring=this.getParameter$S("e");
var fstring=this.getParameter$S("f");
var hstring=this.getParameter$S("h");
var kstring=this.getParameter$S("k");
var mstring=this.getParameter$S("m");
var nstring=this.getParameter$S("n");
var pstring=this.getParameter$S("p");
this.curvename=curvenamestring;
if (tminstring != null ) {
try {
this.tmin=Double.valueOf$S(tminstring).doubleValue$();
} catch (e) {
if (Clazz.exceptionOf(e,"NumberFormatException")){
} else {
throw e;
}
}
}if (tmaxstring != null ) {
try {
this.tmax=Double.valueOf$S(tmaxstring).doubleValue$();
} catch (e) {
if (Clazz.exceptionOf(e,"NumberFormatException")){
} else {
throw e;
}
}
}if (numberofpointsstring != null ) {
try {
this.numberofpoints=Integer.valueOf$S(numberofpointsstring).intValue$();
this.numberofpointsb=true;
} catch (e) {
if (Clazz.exceptionOf(e,"NumberFormatException")){
} else {
throw e;
}
}
}if (tdstring != null ) {
try {
this.td=Double.valueOf$S(tdstring).doubleValue$();
this.tdb=true;
} catch (e) {
if (Clazz.exceptionOf(e,"NumberFormatException")){
} else {
throw e;
}
}
}if (dtstring != null ) {
try {
this.dt=Double.valueOf$S(dtstring).doubleValue$();
} catch (e) {
if (Clazz.exceptionOf(e,"NumberFormatException")){
} else {
throw e;
}
}
}if (xbstring != null ) {
try {
this.xb=Double.valueOf$S(xbstring).doubleValue$();
} catch (e) {
if (Clazz.exceptionOf(e,"NumberFormatException")){
} else {
throw e;
}
}
}if (xtstring != null ) {
try {
this.xt=Double.valueOf$S(xtstring).doubleValue$();
} catch (e) {
if (Clazz.exceptionOf(e,"NumberFormatException")){
} else {
throw e;
}
}
}if (ybstring != null ) {
try {
this.yb=Double.valueOf$S(ybstring).doubleValue$();
} catch (e) {
if (Clazz.exceptionOf(e,"NumberFormatException")){
} else {
throw e;
}
}
}if (ytstring != null ) {
try {
this.yt=Double.valueOf$S(ytstring).doubleValue$();
} catch (e) {
if (Clazz.exceptionOf(e,"NumberFormatException")){
} else {
throw e;
}
}
}if (supportedparametersstring != null ) {
try {
this.supportedparameters=supportedparametersstring;
} catch (e) {
if (Clazz.exceptionOf(e,"NumberFormatException")){
} else {
throw e;
}
}
}if (astring != null ) {
try {
this.a=Double.valueOf$S(astring).doubleValue$();
if (this.supportedparameters.indexOf$S("a") >= 0) {
this.ap=true;
}} catch (e) {
if (Clazz.exceptionOf(e,"NumberFormatException")){
} else {
throw e;
}
}
}if (bstring != null ) {
try {
this.b=Double.valueOf$S(bstring).doubleValue$();
if (this.supportedparameters.indexOf$S("b") >= 0) {
this.bp=true;
}} catch (e) {
if (Clazz.exceptionOf(e,"NumberFormatException")){
} else {
throw e;
}
}
}if (cstring != null ) {
try {
this.c=Double.valueOf$S(cstring).doubleValue$();
if (this.supportedparameters.indexOf$S("c") >= 0) {
this.cp=true;
}} catch (e) {
if (Clazz.exceptionOf(e,"NumberFormatException")){
} else {
throw e;
}
}
}if (dstring != null ) {
try {
this.d=Double.valueOf$S(dstring).doubleValue$();
if (this.supportedparameters.indexOf$S("d") >= 0) {
this.dp=true;
}} catch (e) {
if (Clazz.exceptionOf(e,"NumberFormatException")){
} else {
throw e;
}
}
}if (estring != null ) {
try {
this.e=Double.valueOf$S(estring).doubleValue$();
if (this.supportedparameters.indexOf$S("e") >= 0) {
this.ep=true;
}} catch (e) {
if (Clazz.exceptionOf(e,"NumberFormatException")){
} else {
throw e;
}
}
}if (fstring != null ) {
try {
this.f=Double.valueOf$S(fstring).doubleValue$();
if (this.supportedparameters.indexOf$S("f") >= 0) {
this.fp=true;
}} catch (e) {
if (Clazz.exceptionOf(e,"NumberFormatException")){
} else {
throw e;
}
}
}if (hstring != null ) {
try {
this.h=Double.valueOf$S(hstring).doubleValue$();
if (this.supportedparameters.indexOf$S("h") >= 0) {
this.hp=true;
}} catch (e) {
if (Clazz.exceptionOf(e,"NumberFormatException")){
} else {
throw e;
}
}
}if (kstring != null ) {
try {
this.k=Double.valueOf$S(kstring).doubleValue$();
if (this.supportedparameters.indexOf$S("k") >= 0) {
this.kp=true;
}} catch (e) {
if (Clazz.exceptionOf(e,"NumberFormatException")){
} else {
throw e;
}
}
}if (mstring != null ) {
try {
this.m=Double.valueOf$S(mstring).doubleValue$();
if (this.supportedparameters.indexOf$S("m") >= 0) {
this.mp=true;
}} catch (e) {
if (Clazz.exceptionOf(e,"NumberFormatException")){
} else {
throw e;
}
}
}if (nstring != null ) {
try {
this.n=Double.valueOf$S(nstring).doubleValue$();
if (this.supportedparameters.indexOf$S("n") >= 0) {
this.np=true;
}} catch (e) {
if (Clazz.exceptionOf(e,"NumberFormatException")){
} else {
throw e;
}
}
}if (pstring != null ) {
try {
this.p=Double.valueOf$S(pstring).doubleValue$();
if (this.supportedparameters.indexOf$S("p") >= 0) {
this.pp=true;
}} catch (e) {
if (Clazz.exceptionOf(e,"NumberFormatException")){
} else {
throw e;
}
}
}if (this.tdb) {
if (this.ap || this.bp || this.cp || this.dp || this.ep || this.fp || this.hp || this.kp || this.mp || this.np || this.pp  ) {
this.curve=Clazz.new_($I$(1).c$$S$D$D$D$D$D$D$D$D$D$D$D$D$D$D$D$D$D$D$D,[this.curvename, this.tmin, this.tmax, this.td, this.dt, this.xb, this.xt, this.yb, this.yt, this.a, this.b, this.c, this.d, this.e, this.f, this.h, this.k, this.m, this.n, this.p]);
} else {
this.curve=Clazz.new_($I$(1).c$$S$D$D$D,[this.curvename, this.tmin, this.tmax, this.td]);
}} else {
if (this.ap || this.bp || this.cp || this.dp || this.ep || this.fp || this.hp || this.kp || this.mp || this.np || this.pp  ) {
this.curve=Clazz.new_($I$(1).c$$S$D$D$I$D$D$D$D$D$D$D$D$D$D$D$D$D$D$D$D,[this.curvename, this.tmin, this.tmax, this.numberofpoints, this.dt, this.xb, this.xt, this.yb, this.yt, this.a, this.b, this.c, this.d, this.e, this.f, this.h, this.k, this.m, this.n, this.p]);
} else {
this.curve=Clazz.new_($I$(1).c$$S$D$D$D,[this.curvename, this.tmin, this.tmax, this.td]);
}}this.setLayout$java_awt_LayoutManager(Clazz.new_($I$(2)));
this.curvepanel=Clazz.new_($I$(3).c$$uk_ac_stand_mcs_wwwhistory_famouscurves_Curve$I,[this.curve, 0]);
this.curvepanel.setParameters$D$D$D$D$D$D$D$D$D$D$D(this.a, this.b, this.c, this.d, this.e, this.f, this.h, this.k, this.m, this.n, this.p);
this.add$S$java_awt_Component("Center", this.curvepanel);
this.curvecontrols=Clazz.new_($I$(4).c$$uk_ac_stand_mcs_wwwhistory_famouscurves_CurvePanel$Z$Z$Z$Z$Z$Z$Z$Z$Z$Z$Z,[this.curvepanel, this.ap, this.bp, this.cp, this.dp, this.ep, this.fp, this.hp, this.kp, this.mp, this.np, this.pp]);
this.add$S$java_awt_Component("South", this.curvecontrols);
});

Clazz.newMeth(C$);
})();
;Clazz.setTVer('3.2.4.07');//Created 2019-08-02 17:21:01 Java2ScriptVisitor version 3.2.4.07 net.sf.j2s.core.jar version 3.2.4.07
