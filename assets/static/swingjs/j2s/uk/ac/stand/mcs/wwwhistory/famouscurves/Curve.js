(function(){var P$=Clazz.newPackage("uk.ac.stand.mcs.wwwhistory.famouscurves"),I$=[];
var C$=Clazz.newClass(P$, "Curve");
C$.xsc=0;
C$.ysc=0;
C$.Ox=0;
C$.Oy=0;
C$.xsize=0;
C$.ysize=0;

C$.$clinit$ = function() {Clazz.load(C$, 1);
}

Clazz.newMeth(C$, '$init0$', function () {
var c;if((c = C$.superclazz) && (c = c.$init0$))c.apply(this);
this.name=null;
this.fx=null;
this.fy=null;
this.dt=0;
this.fxbefore=null;
this.fybefore=null;
this.fxafter=null;
this.fyafter=null;
this.fxpixels=null;
this.fypixels=null;
this.tmin=0;
this.tmax=0;
this.t=null;
this.td=0;
this.nop=0;
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
this.xb=0;
this.xt=0;
this.yb=0;
this.yt=0;
this.xrange=0;
this.yrange=0;
this.scalingfactor=0;
}, 1);

Clazz.newMeth(C$, '$init$', function () {
}, 1);

Clazz.newMeth(C$, 'setScale$D$D', function (xs, ys) {
C$.xsc=xs;
C$.ysc=ys;
}, 1);

Clazz.newMeth(C$, 'factorScale$D$D', function (xf, yf) {
C$.xsc *= xf;
C$.ysc *= yf;
}, 1);

Clazz.newMeth(C$, 'factorScale$D', function (f) {
C$.xsc *= f;
C$.ysc *= f;
}, 1);

Clazz.newMeth(C$, 'setOrigin$I$I', function (ox, oy) {
C$.Ox=ox;
C$.Oy=oy;
}, 1);

Clazz.newMeth(C$, 'translateOrigin$I$I', function (tx, ty) {
C$.Ox+=tx;
C$.Oy-=ty;
}, 1);

Clazz.newMeth(C$, 'xPixelToPoint$I', function (xpix) {
return (xpix - C$.Ox) / C$.xsc;
}, 1);

Clazz.newMeth(C$, 'yPixelToPoint$I', function (ypix) {
return (C$.Oy - ypix) / C$.ysc;
}, 1);

Clazz.newMeth(C$, 'xPointToPixel$D', function (xpt) {
return ((xpt * C$.xsc + C$.Ox)|0);
}, 1);

Clazz.newMeth(C$, 'yPointToPixel$D', function (ypt) {
return ((-ypt * C$.ysc + C$.Oy)|0);
}, 1);

Clazz.newMeth(C$, 'sign$D', function (d) {
if (d > 0 ) {
return 1;
} else {
if (d < 0 ) {
return -1;
} else {
return 0;
}}}, 1);

Clazz.newMeth(C$, 'sinh$D', function (t) {
return (Math.exp(t) - Math.exp(-t)) / 2;
}, 1);

Clazz.newMeth(C$, 'cosh$D', function (t) {
return (Math.exp(t) + Math.exp(-t)) / 2;
}, 1);

Clazz.newMeth(C$, 'tanh$D', function (t) {
return C$.sinh$D(t) / C$.cosh$D(t);
}, 1);

Clazz.newMeth(C$, 'sec$D', function (t) {
return 1 / Math.cos(t);
}, 1);

Clazz.newMeth(C$, 'cosec$D', function (t) {
return 1 / Math.sin(t);
}, 1);

Clazz.newMeth(C$, 'cot$D', function (t) {
return 1 / Math.tan(t);
}, 1);

Clazz.newMeth(C$, 'lineEnds$D$D', function (m, c) {
var endpoints=Clazz.array(Integer.TYPE, [2, 2]);
var xb=C$.xPixelToPoint$I(0);
var xt=C$.xPixelToPoint$I(C$.xsize);
var yt=C$.yPixelToPoint$I(0);
endpoints[0][0]=0;
endpoints[1][0]=C$.yPointToPixel$D(xb * m + c);
endpoints[0][1]=C$.xsize;
endpoints[1][1]=C$.yPointToPixel$D(xt * m + c);
return endpoints;
}, 1);

Clazz.newMeth(C$, 'c$$S$D$D$D', function (name, tmin, tmax, td) {
C$.$init$.apply(this);
this.name=name;
this.tmin=tmin;
this.tmax=tmax;
this.td=td;
this.nop=(((this.tmax - this.tmin) / (this.td))|0);
this.dt=this.td / 10;
this.t=Clazz.array(Double.TYPE, [this.nop + 3]);
this.fx=Clazz.array(Double.TYPE, [this.nop + 3]);
this.fy=Clazz.array(Double.TYPE, [this.nop + 3]);
this.fxpixels=Clazz.array(Integer.TYPE, [this.nop + 1]);
this.fypixels=Clazz.array(Integer.TYPE, [this.nop + 1]);
this.fxbefore=Clazz.array(Double.TYPE, [this.nop + 3]);
this.fybefore=Clazz.array(Double.TYPE, [this.nop + 3]);
this.fxafter=Clazz.array(Double.TYPE, [this.nop + 3]);
this.fyafter=Clazz.array(Double.TYPE, [this.nop + 3]);
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
this.xb=-5;
this.xt=5;
this.yb=-5;
this.yt=5;
for (var i=0; i <= this.nop + 2; i++) {
this.t[i]=this.tmin + (i - 1) * this.td;
}
this.xrange=this.xt - this.xb;
this.yrange=this.yt - this.yb;
this.setCurve$();
}, 1);

Clazz.newMeth(C$, 'c$$S$D$D$I', function (name, tmin, tmax, nop) {
C$.$init$.apply(this);
this.name=name;
this.tmin=tmin;
this.tmax=tmax;
this.nop=nop;
this.td=(this.tmax - this.tmin) / (this.nop);
this.dt=this.td / 10;
this.t=Clazz.array(Double.TYPE, [this.nop + 3]);
this.fx=Clazz.array(Double.TYPE, [this.nop + 3]);
this.fy=Clazz.array(Double.TYPE, [this.nop + 3]);
this.fxpixels=Clazz.array(Integer.TYPE, [this.nop + 1]);
this.fypixels=Clazz.array(Integer.TYPE, [this.nop + 1]);
this.fxbefore=Clazz.array(Double.TYPE, [this.nop + 3]);
this.fybefore=Clazz.array(Double.TYPE, [this.nop + 3]);
this.fxafter=Clazz.array(Double.TYPE, [this.nop + 3]);
this.fyafter=Clazz.array(Double.TYPE, [this.nop + 3]);
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
this.xb=-5;
this.xt=5;
this.yb=-5;
this.yt=5;
for (var i=0; i <= this.nop + 2; i++) {
this.t[i]=this.tmin + (i - 1) * this.td;
}
this.xrange=this.xt - this.xb;
this.yrange=this.yt - this.yb;
this.setCurve$();
}, 1);

Clazz.newMeth(C$, 'c$$S$D$D$D$D$D$D$D$D$D$D$D$D$D$D$D$D$D$D$D', function (name, tmin, tmax, td, dt, xb, xt, yb, yt, a, b, c, d, e, f, h, k, m, n, p) {
C$.$init$.apply(this);
this.name=name;
this.tmin=tmin;
this.tmax=tmax;
this.td=td;
this.nop=(((this.tmax - this.tmin) / (this.td))|0);
this.dt=dt;
this.t=Clazz.array(Double.TYPE, [this.nop + 3]);
this.fx=Clazz.array(Double.TYPE, [this.nop + 3]);
this.fy=Clazz.array(Double.TYPE, [this.nop + 3]);
this.fxpixels=Clazz.array(Integer.TYPE, [this.nop + 1]);
this.fypixels=Clazz.array(Integer.TYPE, [this.nop + 1]);
this.fxbefore=Clazz.array(Double.TYPE, [this.nop + 3]);
this.fybefore=Clazz.array(Double.TYPE, [this.nop + 3]);
this.fxafter=Clazz.array(Double.TYPE, [this.nop + 3]);
this.fyafter=Clazz.array(Double.TYPE, [this.nop + 3]);
this.xb=xb;
this.xt=xt;
this.yb=yb;
this.yt=yt;
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
for (var i=0; i <= this.nop + 2; i++) {
this.t[i]=this.tmin + (i - 1) * this.td;
}
this.xrange=xt - xb;
this.yrange=yt - yb;
this.setCurve$();
}, 1);

Clazz.newMeth(C$, 'c$$S$D$D$I$D$D$D$D$D$D$D$D$D$D$D$D$D$D$D$D', function (name, tmin, tmax, nop, dt, xb, xt, yb, yt, a, b, c, d, e, f, h, k, m, n, p) {
C$.$init$.apply(this);
this.name=name;
this.tmin=tmin;
this.tmax=tmax;
this.nop=nop;
this.td=(this.tmax - this.tmin) / (this.nop);
this.dt=dt;
this.t=Clazz.array(Double.TYPE, [this.nop + 3]);
this.fx=Clazz.array(Double.TYPE, [this.nop + 3]);
this.fy=Clazz.array(Double.TYPE, [this.nop + 3]);
this.fxpixels=Clazz.array(Integer.TYPE, [this.nop + 1]);
this.fypixels=Clazz.array(Integer.TYPE, [this.nop + 1]);
this.fxbefore=Clazz.array(Double.TYPE, [this.nop + 3]);
this.fybefore=Clazz.array(Double.TYPE, [this.nop + 3]);
this.fxafter=Clazz.array(Double.TYPE, [this.nop + 3]);
this.fyafter=Clazz.array(Double.TYPE, [this.nop + 3]);
this.xb=xb;
this.xt=xt;
this.yb=yb;
this.yt=yt;
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
for (var i=0; i <= this.nop + 2; i++) {
this.t[i]=this.tmin + (i - 1) * this.td;
}
this.xrange=xt - xb;
this.yrange=yt - yb;
this.setCurve$();
}, 1);

Clazz.newMeth(C$, 'setCurve$', function () {
var tmppoints=this.offPoints$D(0.0);
this.fx=tmppoints[0];
this.fy=tmppoints[1];
for (var i=0; i <= this.n ; i++) {
this.fxpixels[i]=C$.xPointToPixel$D(this.fx[i + 1]);
this.fypixels[i]=C$.yPointToPixel$D(this.fy[i + 1]);
}
var tmpbeforepoints=this.offPoints$D(this.dt);
var tmpafterpoints=this.offPoints$D(-this.dt);
this.fxbefore=tmpbeforepoints[0];
this.fybefore=tmpbeforepoints[1];
this.fxafter=tmpafterpoints[0];
this.fyafter=tmpafterpoints[1];
});

Clazz.newMeth(C$, 'offPoints$D', function (dd) {
var tmpn;
var tmppoints=Clazz.array(Double.TYPE, [2, this.nop + 3]);
if (this.name == null ) {
this.name="Astroid";
System.out.println$S("No curvename parameter found.  Assuming '" + this.name + "'" );
}if (this.name.equals$O("Astroid")) {
for (var i=0; i <= this.nop + 2; i++) {
var tt=this.t[i] + dd;
tmppoints[0][i]=this.a * Math.pow(this.a * Math.cos(tt), 3.0);
tmppoints[1][i]=this.a * Math.pow(this.a * Math.sin(tt), 3.0);
}
} else if (this.name.equals$O("Cardioid")) {
for (var i=0; i <= this.nop + 2; i++) {
var tt=this.t[i] + dd;
tmppoints[0][i]=this.a * Math.cos(tt) * (1 + Math.cos(tt)) ;
tmppoints[1][i]=this.a * Math.sin(tt) * (1 + Math.cos(tt)) ;
}
} else if (this.name.equals$O("Catenary")) {
for (var i=0; i <= this.nop + 2; i++) {
var tt=this.t[i] + dd;
tmppoints[0][i]=tt - 5;
tmppoints[1][i]=this.a * C$.cosh$D((tt - 5) / this.a);
}
} else if (this.name.equals$O("Cayley\'s Sextic")) {
for (var i=0; i <= this.nop + 2; i++) {
var tt=this.t[i] + dd;
tmppoints[0][i]=this.a * Math.cos(tt) * 4 * Math.pow(Math.cos(tt / 3), 3) ;
tmppoints[1][i]=this.a * Math.sin(tt) * 4 * Math.pow(Math.cos(tt / 3), 3) ;
}
} else if (this.name.equals$O("Circle")) {
for (var i=0; i <= this.nop + 2; i++) {
var tt=this.t[i] + dd;
tmppoints[0][i]=this.a * Math.cos(tt);
tmppoints[1][i]=this.a * Math.sin(tt);
}
} else if (this.name.equals$O("Cissoid of Diocles")) {
for (var i=0; i <= this.nop + 2; i++) {
var tt=this.t[i] + dd;
tmppoints[0][i]=2 * this.a * Math.cos(tt) * Math.tan(tt) * Math.sin(tt) ;
tmppoints[1][i]=2 * this.a * Math.sin(tt) * Math.tan(tt) * Math.sin(tt) ;
}
} else if (this.name.equals$O("Cochleoid")) {
for (var i=0; i <= this.nop + 2; i++) {
var tt=this.t[i] + dd;
tmppoints[0][i]=this.a * Math.cos(tt) * Math.sin(tt)  / tt;
tmppoints[1][i]=this.a * Math.pow(Math.sin(tt), 2) / tt;
}
} else if (this.name.equals$O("Conchoid")) {
for (var i=0; i <= this.nop + 2; i++) {
var tt=this.t[i] + dd;
tmppoints[0][i]=Math.cos(tt) * (this.a + this.b * C$.sec$D(tt));
tmppoints[1][i]=Math.sin(tt) * (this.a + this.b * C$.sec$D(tt));
}
} else if (this.name.equals$O("Conchoid of de Sluze")) {
for (var i=0; i <= this.nop + 2; i++) {
var tt=this.t[i] + dd;
tmppoints[0][i]=Math.cos(tt) * (-this.a / Math.cos(tt) + (this.k * this.k / this.a) * Math.cos(tt));
tmppoints[1][i]=Math.sin(tt) * (-this.a / Math.cos(tt) + (this.k * this.k / this.a) * Math.cos(tt));
}
} else if (this.name.equals$O("Cycloid")) {
for (var i=0; i <= this.nop + 2; i++) {
var tt=this.t[i] + dd;
tmppoints[0][i]=this.a * (tt - 22) - this.h * Math.sin(tt - 22);
tmppoints[1][i]=this.a - this.h * Math.cos(tt - 22);
}
} else if (this.name.equals$O("Devil\'s Curve")) {
for (var i=0; i <= this.nop + 2; i++) {
var tt=this.t[i] + dd;
tmppoints[0][i]=this.a * Math.cos(tt) * Math.sqrt((25 - 24 * Math.pow(Math.tan(tt), 2)) / (1 - Math.pow(Math.tan(tt), 2))) ;
tmppoints[1][i]=this.a * Math.sin(tt) * Math.sqrt((25 - 24 * Math.pow(Math.tan(tt), 2)) / (1 - Math.pow(Math.tan(tt), 2))) ;
}
} else if (this.name.equals$O("Double Folium")) {
for (var i=0; i <= this.nop + 2; i++) {
var tt=this.t[i] + dd;
tmppoints[0][i]=4 * this.a * Math.cos(tt) * Math.cos(tt) * Math.pow(Math.sin(tt), 2) ;
tmppoints[1][i]=4 * this.a * Math.sin(tt) * Math.cos(tt) * Math.pow(Math.sin(tt), 2) ;
}
} else if (this.name.equals$O("Eight Curve")) {
for (var i=0; i <= this.nop + 2; i++) {
var tt=this.t[i] + dd;
tmppoints[0][i]=this.a * Math.cos(tt) * Math.sqrt(Math.cos(2 * tt)) * Math.pow(C$.sec$D(tt), 2) ;
tmppoints[1][i]=this.a * Math.sin(tt) * Math.sqrt(Math.cos(2 * tt)) * Math.pow(C$.sec$D(tt), 2) ;
}
} else if (this.name.equals$O("Ellipse")) {
for (var i=0; i <= this.nop + 2; i++) {
var tt=this.t[i] + dd;
tmppoints[0][i]=this.a * Math.cos(tt);
tmppoints[1][i]=this.b * Math.sin(tt);
}
} else if (this.name.equals$O("Epicycloid")) {
for (var i=0; i <= this.nop + 2; i++) {
var tt=this.t[i] + dd;
tmppoints[0][i]=(this.a + this.b) * Math.cos(tt) - this.b * Math.cos((this.a / this.b + 1) * tt);
tmppoints[1][i]=(this.a + this.b) * Math.sin(tt) - this.b * Math.sin((this.a / this.b + 1) * tt);
}
} else if (this.name.equals$O("Epitrochoid")) {
for (var i=0; i <= this.nop + 2; i++) {
var tt=this.t[i] + dd;
tmppoints[0][i]=(this.a + this.b) * Math.cos(tt) - this.c * Math.cos((this.a / this.b + 1) * tt);
tmppoints[1][i]=(this.a + this.b) * Math.sin(tt) - this.c * Math.sin((this.a / this.b + 1) * tt);
}
} else if (this.name.equals$O("Equiangular Spiral")) {
for (var i=0; i <= this.nop + 2; i++) {
var tt=this.t[i] + dd;
tmppoints[0][i]=this.a * Math.cos(4 * (tt - 3.141592653589793)) * Math.exp(C$.cot$D(this.b) * 4 * (tt - 3.141592653589793) ) ;
tmppoints[1][i]=this.a * Math.sin(4 * (tt - 3.141592653589793)) * Math.exp(C$.cot$D(this.b) * 4 * (tt - 3.141592653589793) ) ;
}
} else if (this.name.equals$O("Fermat\'s Spiral")) {
for (var i=0; i <= this.nop + 2; i++) {
var tt=this.t[i] + dd;
tmppoints[0][i]=this.a * Math.cos(tt - 24) * Math.sqrt(Math.abs(tt - 24)) * C$.sign$D(tt - 24) ;
tmppoints[1][i]=this.a * Math.sin(tt - 24) * Math.sqrt(Math.abs(tt - 24)) ;
}
} else if (this.name.equals$O("Folium")) {
for (var i=0; i <= this.nop + 2; i++) {
var tt=this.t[i] + dd;
tmppoints[0][i]=Math.cos(tt) * (-this.b * Math.cos(tt) + 4 * this.a * Math.cos(tt) * Math.pow(Math.sin(tt), 2) );
tmppoints[1][i]=Math.sin(tt) * (-this.b * Math.cos(tt) + 4 * this.a * Math.cos(tt) * Math.pow(Math.sin(tt), 2) );
}
} else if (this.name.equals$O("Folium of Descartes")) {
for (var i=0; i <= this.nop + 2; i++) {
var tt=this.t[i] + dd;
tmppoints[0][i]=3 * this.a * (tt - 10)  / (1 + Math.pow(tt - 10, 3.0));
tmppoints[1][i]=3 * this.a * Math.pow(tt - 10, 2.0)  / (1 + Math.pow(tt - 10, 3.0));
}
} else if (this.name.equals$O("Freeth\'s Nephroid")) {
for (var i=0; i <= this.nop + 2; i++) {
var tt=this.t[i] + dd;
tmppoints[0][i]=this.a * Math.cos(tt) * (1 + 2 * Math.sin(tt / 2)) ;
tmppoints[1][i]=this.a * Math.sin(tt) * (1 + 2 * Math.sin(tt / 2)) ;
}
} else if (this.name.equals$O("Frequency Curve")) {
for (var i=0; i <= this.nop + 2; i++) {
var tt=this.t[i] + dd;
tmppoints[0][i]=(tt - 4);
tmppoints[1][i]=Math.sqrt(2) * Math.exp(-Math.pow(tt - 4, 2.0) / 2);
}
} else if (this.name.equals$O("Hyperbola")) {
for (var i=0; i <= this.nop + 2; i++) {
var tt=this.t[i] + dd;
tmppoints[0][i]=this.a * C$.sec$D(tt);
tmppoints[1][i]=this.b * Math.tan(tt);
}
} else if (this.name.equals$O("Hyperbolic Spiral")) {
for (var i=0; i <= this.nop + 2; i++) {
var tt=this.t[i] + dd;
tmppoints[0][i]=this.a * Math.cos(tt) / tt;
tmppoints[1][i]=this.a * Math.sin(tt) / tt;
}
} else if (this.name.equals$O("Hypocycloid")) {
for (var i=0; i <= this.nop + 2; i++) {
var tt=this.t[i] + dd;
tmppoints[0][i]=(this.a - this.b) * Math.cos(tt) + this.b * Math.cos((this.a / this.b - 1) * tt);
tmppoints[1][i]=(this.a - this.b) * Math.sin(tt) - this.b * Math.sin((this.a / this.b - 1) * tt);
}
} else if (this.name.equals$O("Hypotrochoid")) {
for (var i=0; i <= this.nop + 2; i++) {
var tt=this.t[i] + dd;
tmppoints[0][i]=(this.a - this.b) * Math.cos(tt) + this.c * Math.cos((this.a / this.b - 1) * tt);
tmppoints[1][i]=(this.a - this.b) * Math.sin(tt) - this.c * Math.sin((this.a / this.b - 1) * tt);
}
} else if (this.name.equals$O("Involute of a Circle")) {
for (var i=0; i <= this.nop + 2; i++) {
var tt=this.t[i] + dd;
tmppoints[0][i]=this.a * (Math.cos(tt) + tt * Math.sin(tt));
tmppoints[1][i]=this.a * (Math.sin(tt) - tt * Math.cos(tt));
}
} else if (this.name.equals$O("Kampyle of Eudoxus")) {
for (var i=0; i <= this.nop + 2; i++) {
var tt=this.t[i] + dd;
tmppoints[0][i]=this.b * this.b / (this.a * Math.cos(tt));
tmppoints[1][i]=this.b * this.b * Math.sin(tt)  / (this.a * Math.pow(Math.cos(tt), 2));
}
} else if (this.name.equals$O("Kappa Curve")) {
for (var i=0; i <= this.nop + 2; i++) {
var tt=this.t[i] + dd;
tmppoints[0][i]=this.a * Math.cos(tt) * C$.cot$D(tt) ;
tmppoints[1][i]=this.a * Math.cos(tt);
}
} else if (this.name.equals$O("Lame Curves")) {
for (var i=0; i <= this.nop + 2; i++) {
var tt=this.t[i] + dd;
tmpn=1 / this.n + 0.0;
tmppoints[0][i]=this.a * Math.pow(Math.cos(tt - 4) * Math.cos(tt - 4), tmpn) * C$.sign$D(Math.cos(tt - 4)) ;
tmppoints[1][i]=this.b * Math.pow(Math.sin(tt - 4) * Math.sin(tt - 4), tmpn) * C$.sign$D(Math.sin(tt - 4)) ;
}
} else if (this.name.equals$O("Lemniscate of Bernoulli")) {
for (var i=0; i <= this.nop + 2; i++) {
var tt=this.t[i] + dd;
tmppoints[0][i]=this.a * Math.cos(tt) * Math.sqrt(Math.cos(2 * tt)) ;
tmppoints[1][i]=this.a * Math.sin(tt) * Math.sqrt(Math.cos(2 * tt)) ;
}
} else if (this.name.equals$O("Limacon of Pascal")) {
for (var i=0; i <= this.nop + 2; i++) {
var tt=this.t[i] + dd;
tmppoints[0][i]=Math.cos(tt) * (this.b + 2 * this.a * Math.cos(tt) );
tmppoints[1][i]=Math.sin(tt) * (this.b + 2 * this.a * Math.cos(tt) );
}
} else if (this.name.equals$O("Lissajous Curves")) {
for (var i=0; i <= this.nop + 2; i++) {
var tt=this.t[i] + dd;
tmppoints[0][i]=this.a * Math.sin(this.n * tt + this.c);
tmppoints[1][i]=this.b * Math.sin(tt);
}
} else if (this.name.equals$O("Lituus")) {
for (var i=0; i <= this.nop + 2; i++) {
var tt=this.t[i] + dd;
tmppoints[0][i]=this.a * Math.cos(tt - 28) / Math.sqrt(Math.abs(tt - 28)) * C$.sign$D(tt - 28);
tmppoints[1][i]=this.a * Math.sin(tt - 28) / Math.sqrt(Math.abs(tt - 28));
}
} else if (this.name.equals$O("Neile\'s Semi-cubical Parabola")) {
for (var i=0; i <= this.nop + 2; i++) {
var tt=this.t[i] + dd;
tmppoints[0][i]=tt - 30;
tmppoints[1][i]=Math.pow(this.a * (tt - 30) * (tt - 30) , 0.33333);
}
} else if (this.name.equals$O("Nephroid")) {
for (var i=0; i <= this.nop + 2; i++) {
var tt=this.t[i] + dd;
tmppoints[0][i]=this.a * (3 * Math.cos(tt) - Math.cos(3 * tt));
tmppoints[1][i]=this.a * (3 * Math.sin(tt) - Math.sin(3 * tt));
}
} else if (this.name.equals$O("Parabola")) {
for (var i=0; i <= this.nop + 2; i++) {
var tt=this.t[i] + dd;
tmppoints[0][i]=tt - 4;
tmppoints[1][i]=this.a * (tt - 4) * (tt - 4)  + this.b * (tt - 4) + this.c;
}
} else if (this.name.equals$O("Pear-shaped Quartic")) {
for (var i=0; i <= this.nop + 2; i++) {
var tt=this.t[i] + dd;
tmppoints[0][i]=Math.abs(tt - 3);
tmppoints[1][i]=(1 / this.b) * (tt - 3) * Math.sqrt(-Math.pow((tt - 3), 2) + this.a * Math.abs(tt - 3))  / 2;
}
} else if (this.name.equals$O("Plateau Curves")) {
for (var i=0; i <= this.nop + 2; i++) {
var tt=this.t[i] + dd;
tmppoints[0][i]=this.a * (Math.sin((this.m + this.n) * tt)) / (Math.sin((this.m - this.n) * tt));
tmppoints[1][i]=(2 * this.a * Math.sin(this.m * tt) * Math.sin(this.n * tt) ) / (Math.sin((this.m - this.n) * tt));
}
} else if (this.name.equals$O("Pursuit Curve")) {
for (var i=0; i <= this.nop + 2; i++) {
var tt=this.t[i] + dd;
tmppoints[0][i]=tt;
tmppoints[1][i]=this.c * tt * tt  - Math.log(tt);
}
} else if (this.name.equals$O("Quadratrix of Hippias")) {
for (var i=0; i <= this.nop + 2; i++) {
var tt=this.t[i] + dd;
tmppoints[0][i]=tt - 8;
tmppoints[1][i]=this.a * C$.cot$D(3.141592653589793 * (tt - 8) / (2 * this.a));
}
} else if (this.name.equals$O("Rhodonea Curves")) {
for (var i=0; i <= this.nop + 2; i++) {
var tt=this.t[i] + dd;
tmppoints[0][i]=this.a * Math.cos(tt) * Math.sin(this.k * tt) ;
tmppoints[1][i]=this.a * Math.sin(tt) * Math.sin(this.k * tt) ;
}
} else if (this.name.equals$O("Right Strophoid")) {
for (var i=0; i <= this.nop + 2; i++) {
var tt=this.t[i] + dd;
tmppoints[0][i]=this.a * Math.cos(2 * tt);
tmppoints[1][i]=this.a * Math.cos(2 * tt) * Math.tan(tt) ;
}
} else if (this.name.equals$O("Serpentine")) {
if (this.a * this.b < 0 ) {
this.b=-this.b;
}for (var i=0; i <= this.nop + 2; i++) {
var tt=this.t[i] + dd;
tmppoints[0][i]=tt - 5;
tmppoints[1][i]=this.a * this.a * (tt - 5)  / ((tt - 5) * (tt - 5) + this.a * this.b);
}
} else if (this.name.equals$O("Sinusoidal Spirals")) {
tmpn=1 / this.p + 0.0;
for (var i=0; i <= this.nop + 2; i++) {
var tt=this.t[i] + dd;
tmppoints[0][i]=this.a * Math.cos(tt) * Math.pow(Math.cos(this.p * tt), tmpn) ;
tmppoints[1][i]=this.a * Math.sin(tt) * Math.pow(Math.cos(this.p * tt), tmpn) ;
}
} else if (this.name.equals$O("Spiral of Archimedes")) {
for (var i=0; i <= this.nop + 2; i++) {
var tt=this.t[i] + dd;
tmppoints[0][i]=this.a * tt * Math.cos(tt) ;
tmppoints[1][i]=this.a * tt * Math.sin(tt) ;
}
} else if (this.name.equals$O("Straight Line")) {
for (var i=0; i <= this.nop + 2; i++) {
var tt=this.t[i] + dd;
tmppoints[0][i]=tt - 10;
tmppoints[1][i]=this.m * (tt - 10) + this.c;
}
} else if (this.name.equals$O("Talbot\'s Curve")) {
for (var i=0; i <= this.nop + 2; i++) {
var tt=this.t[i] + dd;
tmppoints[0][i]=(this.a * this.a + this.f * this.f * Math.pow(Math.sin(tt), 2) ) * Math.cos(tt) / this.a;
tmppoints[1][i]=(1 / this.b) * (this.a * this.a - 2 * this.f * this.f  + this.f * this.f * Math.pow(Math.sin(tt), 2) ) * Math.sin(tt) ;
}
} else if (this.name.equals$O("Tractrix")) {
for (var i=0; i <= this.nop + 2; i++) {
var tt=this.t[i] + dd;
tmppoints[0][i]=1 / C$.cosh$D(tt - 5);
tmppoints[1][i]=tt - 5 - C$.tanh$D(tt - 5) ;
}
} else if (this.name.equals$O("Tricuspoid")) {
for (var i=0; i <= this.nop + 2; i++) {
var tt=this.t[i] + dd;
tmppoints[0][i]=this.a * (2 * Math.cos(tt) + Math.cos(2 * tt));
tmppoints[1][i]=this.a * (2 * Math.sin(tt) - Math.sin(2 * tt));
}
} else if (this.name.equals$O("Trident of Newton")) {
for (var i=0; i <= this.nop + 2; i++) {
var tt=this.t[i] + dd;
tmppoints[0][i]=tt - 4;
tmppoints[1][i]=this.c * (tt - 4) * (tt - 4)  + this.d * (tt - 4) + this.e + this.f / (tt - 4);
}
} else if (this.name.equals$O("Trifolium")) {
for (var i=0; i <= this.nop + 2; i++) {
var tt=this.t[i] + dd;
tmppoints[0][i]=this.a * Math.cos(tt) * (-Math.cos(tt) + 4 * Math.cos(tt) * Math.pow(Math.sin(tt), 2) ) ;
tmppoints[1][i]=this.a * Math.sin(tt) * (-Math.cos(tt) + 4 * Math.cos(tt) * Math.pow(Math.sin(tt), 2) ) ;
}
} else if (this.name.equals$O("Trisectrix of Maclaurin")) {
for (var i=0; i <= this.nop + 2; i++) {
var tt=this.t[i] + dd;
tmppoints[0][i]=2 * this.a * Math.cos(tt) * Math.sin(3 * tt)  / Math.sin(2 * tt);
tmppoints[1][i]=2 * this.a * Math.sin(tt) * Math.sin(3 * tt)  / Math.sin(2 * tt);
}
} else if (this.name.equals$O("Tschirnhaus\' Cubic")) {
for (var i=0; i <= this.nop + 2; i++) {
var tt=this.t[i] + dd;
tmppoints[0][i]=Math.abs(tt - 2);
tmppoints[1][i]=(tt - 2) * Math.sqrt((Math.abs(tt - 2) - 2 * this.a + this.a * this.a / Math.abs(tt - 2)) / (3 * this.a));
}
} else if (this.name.equals$O("Watt\'s Curve")) {
for (var i=0; i <= this.nop + 2; i++) {
var tt=this.t[i] + dd;
tmppoints[0][i]=Math.cos(tt) * Math.sqrt(this.b * this.b - Math.pow(this.a * Math.sin(tt) + (Math.abs(tt - 6.283185307179586) / (tt - 6.283185307179586)) * Math.sqrt(this.c * this.c - this.a * this.a * Math.pow(Math.cos(tt), 2) ), 2));
tmppoints[1][i]=Math.sin(tt) * Math.sqrt(this.b * this.b - Math.pow(this.a * Math.sin(tt) + (Math.abs(tt - 6.283185307179586) / (tt - 6.283185307179586)) * Math.sqrt(this.c * this.c - this.a * this.a * Math.pow(Math.cos(tt), 2) ), 2));
}
} else if (this.name.equals$O("Witch of Agnesi")) {
for (var i=0; i <= this.nop + 2; i++) {
var tt=this.t[i] + dd;
tmppoints[0][i]=this.a * (tt - 5);
tmppoints[1][i]=this.a / ((tt - 5) * (tt - 5) + 1);
}
}return tmppoints;
});

Clazz.newMeth(C$, 'scale$D', function (sc) {
C$.xsc *= sc;
C$.ysc *= sc;
for (var i=0; i <= this.nop; i++) {
this.fxpixels[i]=C$.xPointToPixel$D(this.fx[i + 1]);
this.fypixels[i]=C$.yPointToPixel$D(this.fy[i + 1]);
}
});

Clazz.newMeth(C$, 'translate$I$I', function (xt, yt) {
C$.Ox+=xt;
C$.Oy+=yt;
for (var i=0; i <= this.nop; i++) {
this.fxpixels[i]=C$.xPointToPixel$D(this.fx[i + 1]);
this.fypixels[i]=C$.yPointToPixel$D(this.fy[i + 1]);
}
});

Clazz.newMeth(C$, 'causticPixels$I$I$S', function (zxpix, zypix, mode) {
var causticpixels=Clazz.array(Integer.TYPE, [2, this.nop + 3]);
var x40;
var x0;
var y0;
var x1;
var y1;
var x2;
var y2;
var x4;
var y4;
var xx4;
var yy4;
var m0;
var m1;
var mm0;
var mm1;
var mmm0;
var mmm1;
var tt;
var zx;
var zy;
zx=C$.xPixelToPoint$I(zxpix);
zy=C$.yPixelToPoint$I(zypix);
for (var i=0; i <= this.nop + 2; i++) {
tt=this.t[i];
x0=this.fx[i];
y0=this.fy[i];
x1=this.fxbefore[i];
y1=this.fybefore[i];
x2=this.fxafter[i];
y2=this.fyafter[i];
m0=(y2 - y0) / (x2 - x0);
m1=(y1 - y0) / (x1 - x0);
if (!mode.equals$O("parallel")) {
mm0=(zy - y0) / (zx - x0);
mm1=(zy - y1) / (zx - x1);
} else {
if (zx == 0 ) {
zx=1.0E-6;
}mm0=zy / zx;
mm1=mm0;
}mmm0=(2 * m0 - mm0 + mm0 * m0 * m0 ) / (1 - m0 * m0 + 2 * m0 * mm0 );
mmm1=(2 * m1 - mm1 + mm1 * m1 * m1 ) / (1 - m1 * m1 + 2 * m1 * mm1 );
if (mmm0 != mmm1 ) {
x4=(-y0 + y1 + x0 * mmm0  - x1 * mmm1) / (mmm0 - mmm1);
} else {
x4=0;
}y4=y0 + mmm0 * (x4 - x0);
xx4=C$.xPointToPixel$D(x4);
yy4=C$.yPointToPixel$D(y4);
causticpixels[0][i]=xx4;
causticpixels[1][i]=yy4;
}
return causticpixels;
});

Clazz.newMeth(C$, 'causticPixels$I$I', function (zxpix, zypix) {
var causticpixels=Clazz.array(Integer.TYPE, [2, this.nop + 3]);
var x40;
var x0;
var y0;
var x1;
var y1;
var x2;
var y2;
var x4;
var y4;
var xx4;
var yy4;
var m0;
var m1;
var mm0;
var mm1;
var mmm0;
var mmm1;
var tt;
var zx;
var zy;
zx=C$.xPixelToPoint$I(zxpix);
zy=C$.yPixelToPoint$I(zypix);
for (var i=0; i <= this.nop + 2; i++) {
tt=this.t[i];
x0=this.fx[i];
y0=this.fy[i];
x1=this.fxbefore[i];
y1=this.fybefore[i];
x2=this.fxafter[i];
y2=this.fyafter[i];
m0=(y2 - y0) / (x2 - x0);
m1=(y1 - y0) / (x1 - x0);
mm0=(zy - y0) / (zx - x0);
mm1=(zy - y1) / (zx - x1);
mmm0=(2 * m0 - mm0 + mm0 * m0 * m0 ) / (1 - m0 * m0 + 2 * m0 * mm0 );
mmm1=(2 * m1 - mm1 + mm1 * m1 * m1 ) / (1 - m1 * m1 + 2 * m1 * mm1 );
if (mmm0 != mmm1 ) {
x4=(-y0 + y1 + x0 * mmm0  - x1 * mmm1) / (mmm0 - mmm1);
} else {
x4=0;
}y4=y0 + mmm0 * (x4 - x0);
xx4=C$.xPointToPixel$D(x4);
yy4=C$.yPointToPixel$D(y4);
causticpixels[0][i]=xx4;
causticpixels[1][i]=yy4;
}
return causticpixels;
});

Clazz.newMeth(C$, 'evolutePixels$', function () {
var evolutepixels=Clazz.array(Integer.TYPE, [2, this.nop + 3]);
var x0;
var y0;
var x1;
var y1;
var x2;
var y2;
var x4;
var y4;
var xx4;
var yy4;
var m0;
var m1;
var m2;
var tt;
for (var i=0; i <= this.nop + 2; i++) {
tt=this.t[i];
x0=this.fx[i];
y0=this.fy[i];
x1=this.fxbefore[i];
y1=this.fybefore[i];
x2=this.fxafter[i];
y2=this.fyafter[i];
m1=-(x1 - x0) / (y1 - y0);
m2=-(x2 - x0) / (y2 - y0);
x4=(m1 * (x1 + x0) - m2 * (x2 + x0) - y1 + y2) / (m1 - m2) / 2 ;
y4=(y1 + y0) / 2 + m1 * (x4 - (x1 + x0) / 2);
xx4=C$.xPointToPixel$D(x4);
yy4=C$.yPointToPixel$D(y4);
evolutepixels[0][i]=xx4;
evolutepixels[1][i]=yy4;
}
return evolutepixels;
});

Clazz.newMeth(C$, 'pedalPixels$I$I', function (zxpix, zypix) {
var pedalpixels=Clazz.array(Integer.TYPE, [2, this.nop + 3]);
var x0;
var y0;
var x1;
var y1;
var x4;
var y4;
var xx4;
var yy4;
var m1;
var m2;
var zx;
var zy;
zx=C$.xPixelToPoint$I(zxpix);
zy=C$.yPixelToPoint$I(zypix);
for (var i=0; i <= this.nop + 2; i++) {
x0=this.fx[i];
y0=this.fy[i];
x1=this.fxafter[i];
y1=this.fyafter[i];
m1=(y1 - y0) / (x1 - x0);
m2=-1 / m1;
x4=(m1 * x0 - m2 * zx - y0 + zy) / (m1 - m2);
y4=y0 + m1 * (x4 - x0);
xx4=C$.xPointToPixel$D(x4);
yy4=C$.yPointToPixel$D(y4);
pedalpixels[0][i]=xx4;
pedalpixels[1][i]=yy4;
}
return pedalpixels;
});

Clazz.newMeth(C$, 'negativePedalPixels$I$I', function (zxpix, zypix) {
var negativepedalpixels=Clazz.array(Integer.TYPE, [2, this.nop + 3]);
var x0;
var y0;
var x1;
var y1;
var x4;
var y4;
var x00;
var y00;
var x40;
var y40;
var xx0;
var yy0;
var xx4;
var yy4;
var xx00;
var yy00;
var xx40;
var yy40;
var m0;
var m1;
var m2;
var mm0;
var mm1;
var mmm0;
var mmm1;
var tt;
var zx;
var zy;
zx=C$.xPixelToPoint$I(zxpix);
zy=C$.yPixelToPoint$I(zypix);
for (var i=0; i <= this.nop + 2; i++) {
x0=this.fx[i];
y0=this.fy[i];
x1=this.fxafter[i];
y1=this.fyafter[i];
m0=-(zx - x0) / (zy - y0);
m1=-(zx - x1) / (zy - y1);
if (m0 != m1 ) {
x4=(-y0 + y1 + x0 * m0  - x1 * m1) / (m0 - m1);
} else {
x4=0;
}y4=y0 + m0 * (x4 - x0);
xx4=C$.xPointToPixel$D(x4);
yy4=C$.yPointToPixel$D(y4);
negativepedalpixels[0][i]=xx4;
negativepedalpixels[1][i]=yy4;
}
return negativepedalpixels;
});

Clazz.newMeth(C$, 'inversePixels$I$I$I$I', function (zxpix, zypix, cxpix, cypix) {
var inversepixels=Clazz.array(Integer.TYPE, [2, this.nop + 3]);
var x0;
var y0;
var x4;
var y4;
var r0sq;
var xx4;
var yy4;
var zx;
var zy;
var cx;
var cy;
var rsq;
zx=C$.xPixelToPoint$I(zxpix);
zy=C$.yPixelToPoint$I(zypix);
cx=C$.xPixelToPoint$I(cxpix);
cy=C$.yPixelToPoint$I(cypix);
rsq=(cx - zx) * (cx - zx) + (cy - zy) * (cy - zy);
if (rsq == 0 ) {
rsq=1.0E-9;
}for (var i=0; i <= this.nop + 2; i++) {
x0=this.fx[i];
y0=this.fy[i];
r0sq=(x0 - zx) * (x0 - zx) + (y0 - zy) * (y0 - zy);
x4=zx + rsq / r0sq * (x0 - zx);
y4=zy + rsq / r0sq * (y0 - zy);
xx4=C$.xPointToPixel$D(x4);
yy4=C$.yPointToPixel$D(y4);
inversepixels[0][i]=xx4;
inversepixels[1][i]=yy4;
}
return inversepixels;
});

Clazz.newMeth(C$, 'involutePixels$I$I', function (rxpix, rypix) {
var involutepixels=Clazz.array(Integer.TYPE, [2, this.nop + 3]);
var x0;
var y0;
var x1;
var y1;
var x2;
var y2;
var x4;
var y4;
var x00;
var y00;
var x40;
var y40;
var xx4;
var yy4;
var m;
var mm;
var m0;
var m1;
var m2;
var mm0;
var mm1;
var mmm0;
var mmm1;
var start;
var rx;
var ry;
var r;
rx=C$.xPixelToPoint$I(rxpix);
ry=C$.yPixelToPoint$I(rypix);
r=Math.sqrt(rx * rx + ry * ry);
start=true;
m0=0;
mm0=0;
x00=0;
y00=0;
x40=0;
y40=0;
for (var i=0; i <= this.nop + 2; i++) {
x0=this.fx[i];
y0=this.fy[i];
x1=this.fxafter[i];
y1=this.fyafter[i];
m=(y1 - y0) / (x1 - x0);
mm=(x1 - x0) / (y1 - y0);
if (Math.abs(x1 - x0) > Math.abs(y1 - y0) ) {
if (!start) {
if (m != m0 ) {
x2=(-y0 + y00 + m * x0  - m0 * x00) / (m - m0);
} else {
x2=x1;
}y2=y0 + m * (x2 - x0);
r=Math.sqrt((x2 - x40) * (x2 - x40) + (y2 - y40) * (y2 - y40));
x4=x2 + C$.sign$D(x40 - x2) * r / Math.sqrt(1 + m * m);
y4=y2 + C$.sign$D(x40 - x2) * m * r  / Math.sqrt(1 + m * m);
} else {
x4=x0 + C$.sign$D(x0 - x1) * r / Math.sqrt(1 + m * m);
y4=y0 + C$.sign$D(x0 - x1) * m * r  / Math.sqrt(1 + m * m);
}} else {
if (!start) {
if (mm != mm0 ) {
y2=(-x0 + x00 + mm * y0  - mm0 * y00) / (mm - mm0);
} else {
y2=y1;
}x2=x0 + mm * (y2 - y0);
r=Math.sqrt((x2 - x40) * (x2 - x40) + (y2 - y40) * (y2 - y40));
y4=y2 + C$.sign$D(y40 - y2) * r / Math.sqrt(1 + mm * mm);
x4=x2 + C$.sign$D(y40 - y2) * mm * r  / Math.sqrt(1 + mm * mm);
} else {
y4=y0 + C$.sign$D(y0 - y1) * r / Math.sqrt(1 + mm * mm);
x4=x0 + C$.sign$D(y0 - y1) * mm * r  / Math.sqrt(1 + mm * mm);
}}x40=x4;
y40=y4;
m0=m;
mm0=mm;
xx4=C$.xPointToPixel$D(x4);
yy4=C$.yPointToPixel$D(y4);
involutepixels[0][i]=xx4;
involutepixels[1][i]=yy4;
start=false;
}
return involutepixels;
});

Clazz.newMeth(C$);
})();
;Clazz.setTVer('3.2.4.07');//Created 2019-08-02 17:21:01 Java2ScriptVisitor version 3.2.4.07 net.sf.j2s.core.jar version 3.2.4.07
