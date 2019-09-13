(function(){var P$=Clazz.newPackage("uk.ac.stand.mcs.wwwhistory.famouscurves"),I$=[[0,'uk.ac.stand.mcs.wwwhistory.famouscurves.PointButton','java.awt.Label','java.awt.Color','java.awt.GridBagLayout','java.awt.Font','java.awt.Panel','java.awt.CardLayout','java.awt.Choice','java.awt.GridBagConstraints','java.util.Vector','uk.ac.stand.mcs.wwwhistory.famouscurves.TextPanel','java.awt.Insets','java.awt.Button','uk.ac.stand.mcs.wwwhistory.famouscurves.Curve','java.awt.event.MouseAdapter','uk.ac.stand.mcs.wwwhistory.famouscurves.CurvePanel']],$I$=function(i){return I$[i]||(I$[i]=Clazz.load(I$[0][i]))};
var C$=Clazz.newClass(P$, "CurveControls", null, 'java.awt.Panel');

C$.$clinit$ = function() {Clazz.load(C$, 1);
}

Clazz.newMeth(C$, '$init0$', function () {
var c;if((c = C$.superclazz) && (c = c.$init0$))c.apply(this);
this.curvepanel=null;
this.cards=null;
this.textcard=null;
this.controlcard=null;
this.cardposx=0;
this.cardposy=0;
this.showing=0;
this.curvechoice=null;
this.textpanel=null;
this.show=null;
this.reset=null;
this.zoomin=null;
this.zoomout=null;
this.nozoom=null;
this.up=null;
this.down=null;
this.left=null;
this.right=null;
this.centre=null;
this.parameters=false;
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
this.aleft=null;
this.alabel=null;
this.aright=null;
this.bleft=null;
this.blabel=null;
this.bright=null;
this.cleft=null;
this.clabel=null;
this.cright=null;
this.dleft=null;
this.dlabel=null;
this.dright=null;
this.eleft=null;
this.elabel=null;
this.eright=null;
this.fleft=null;
this.flabel=null;
this.fright=null;
this.hleft=null;
this.hlabel=null;
this.hright=null;
this.kleft=null;
this.klabel=null;
this.kright=null;
this.mleft=null;
this.mlabel=null;
this.mright=null;
this.nleft=null;
this.nlabel=null;
this.nright=null;
this.pleft=null;
this.plabel=null;
this.pright=null;
this.paramincrement=0;
this.piup=null;
this.pilabel=null;
this.pidown=null;
}, 1);

Clazz.newMeth(C$, '$init$', function () {
this.cardposx=0;
this.cardposy=0;
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
this.aleft=Clazz.new_($I$(1).c$$S$I,["West", 10]);
this.alabel=Clazz.new_($I$(2).c$$S$I,["a", 0]);
this.aright=Clazz.new_($I$(1).c$$S$I,["East", 10]);
this.bleft=Clazz.new_($I$(1).c$$S$I,["West", 10]);
this.blabel=Clazz.new_($I$(2).c$$S$I,["b", 0]);
this.bright=Clazz.new_($I$(1).c$$S$I,["East", 10]);
this.cleft=Clazz.new_($I$(1).c$$S$I,["West", 10]);
this.clabel=Clazz.new_($I$(2).c$$S$I,["c", 0]);
this.cright=Clazz.new_($I$(1).c$$S$I,["East", 10]);
this.dleft=Clazz.new_($I$(1).c$$S$I,["West", 10]);
this.dlabel=Clazz.new_($I$(2).c$$S$I,["d", 0]);
this.dright=Clazz.new_($I$(1).c$$S$I,["East", 10]);
this.eleft=Clazz.new_($I$(1).c$$S$I,["West", 10]);
this.elabel=Clazz.new_($I$(2).c$$S$I,["e", 0]);
this.eright=Clazz.new_($I$(1).c$$S$I,["East", 10]);
this.fleft=Clazz.new_($I$(1).c$$S$I,["West", 10]);
this.flabel=Clazz.new_($I$(2).c$$S$I,["f", 0]);
this.fright=Clazz.new_($I$(1).c$$S$I,["East", 10]);
this.hleft=Clazz.new_($I$(1).c$$S$I,["West", 10]);
this.hlabel=Clazz.new_($I$(2).c$$S$I,["h", 0]);
this.hright=Clazz.new_($I$(1).c$$S$I,["East", 10]);
this.kleft=Clazz.new_($I$(1).c$$S$I,["West", 10]);
this.klabel=Clazz.new_($I$(2).c$$S$I,["k", 0]);
this.kright=Clazz.new_($I$(1).c$$S$I,["East", 10]);
this.mleft=Clazz.new_($I$(1).c$$S$I,["West", 10]);
this.mlabel=Clazz.new_($I$(2).c$$S$I,["m", 0]);
this.mright=Clazz.new_($I$(1).c$$S$I,["East", 10]);
this.nleft=Clazz.new_($I$(1).c$$S$I,["West", 10]);
this.nlabel=Clazz.new_($I$(2).c$$S$I,["n", 0]);
this.nright=Clazz.new_($I$(1).c$$S$I,["East", 10]);
this.pleft=Clazz.new_($I$(1).c$$S$I,["West", 10]);
this.plabel=Clazz.new_($I$(2).c$$S$I,["p", 0]);
this.pright=Clazz.new_($I$(1).c$$S$I,["East", 10]);
this.paramincrement=0.1;
this.piup=Clazz.new_($I$(1).c$$S$I,["North", 10]);
this.pilabel=Clazz.new_($I$(2).c$$S$I,["inc", 1]);
this.pidown=Clazz.new_($I$(1).c$$S$I,["South", 10]);
}, 1);

Clazz.newMeth(C$, 'c$$uk_ac_stand_mcs_wwwhistory_famouscurves_CurvePanel', function (curvepanel) {
C$.c$$uk_ac_stand_mcs_wwwhistory_famouscurves_CurvePanel$Z$Z$Z$Z$Z$Z$Z$Z$Z$Z$Z.apply(this, [curvepanel, false, false, false, false, false, false, false, false, false, false, false]);
}, 1);

Clazz.newMeth(C$, 'c$$uk_ac_stand_mcs_wwwhistory_famouscurves_CurvePanel$Z$Z$Z$Z$Z$Z$Z$Z$Z$Z$Z', function (curvepanel, ap, bp, cp, dp, ep, fp, hp, kp, mp, np, pp) {
Clazz.super_(C$, this,1);
this.curvepanel=curvepanel;
this.showing=0;
this.ap=ap;
this.bp=bp;
this.cp=cp;
this.dp=dp;
this.ep=ep;
this.fp=fp;
this.hp=hp;
this.kp=kp;
this.mp=mp;
this.np=np;
this.pp=pp;
this.parameters=true;
var numberofparameters=0;
if (ap) {
numberofparameters++;
}if (bp) {
numberofparameters++;
}if (cp) {
numberofparameters++;
}if (dp) {
numberofparameters++;
}if (ep) {
numberofparameters++;
}if (fp) {
numberofparameters++;
}if (hp) {
numberofparameters++;
}if (kp) {
numberofparameters++;
}if (mp) {
numberofparameters++;
}if (np) {
numberofparameters++;
}if (pp) {
numberofparameters++;
}this.setBackground$java_awt_Color($I$(3).lightGray);
var gb=Clazz.new_($I$(4));
this.setFont$java_awt_Font(Clazz.new_($I$(5).c$$S$I$I,["Helvetica", 0, 10]));
this.setLayout$java_awt_LayoutManager(gb);
this.cards=Clazz.new_($I$(6));
this.cards.setLayout$java_awt_LayoutManager(Clazz.new_($I$(7)));
this.textcard=Clazz.new_($I$(6));
var tcgb=Clazz.new_($I$(4));
this.textcard.setLayout$java_awt_LayoutManager(tcgb);
this.controlcard=Clazz.new_($I$(6));
var ccgb=Clazz.new_($I$(4));
this.controlcard.setLayout$java_awt_LayoutManager(ccgb);
this.curvechoice=Clazz.new_($I$(8));
this.curvechoice.addItem$S("Curve");
this.curvechoice.addItem$S("Evolute");
this.curvechoice.addItem$S("Involute");
this.curvechoice.addItem$S("Inverse");
this.curvechoice.addItem$S("Pedal");
this.curvechoice.addItem$S("Negative Pedal");
this.curvechoice.addItem$S("Caustic (radial)");
this.curvechoice.addItem$S("Caustic (parallel)");
var c=Clazz.new_($I$(9));
c.gridx=1;
c.gridy=0;
c.weightx=1;
c.gridwidth=1;
c.gridheight=1;
c.fill=2;
gb.setConstraints$java_awt_Component$java_awt_GridBagConstraints(this.curvechoice, c);
this.add$java_awt_Component(this.curvechoice);
var blank0=Clazz.new_($I$(2).c$$S,["       "]);
c.gridx=0;
gb.setConstraints$java_awt_Component$java_awt_GridBagConstraints(blank0, c);
this.add$java_awt_Component(blank0);
var blank1=Clazz.new_($I$(2).c$$S,["         "]);
c.gridx=2;
gb.setConstraints$java_awt_Component$java_awt_GridBagConstraints(blank1, c);
this.add$java_awt_Component(blank1);
this.show=Clazz.new_($I$(8));
this.show.addItem$S("Controls");
this.show.addItem$S("Instructions");
this.show.addItem$S("Definition");
c.gridx=3;
c.gridwidth=1;
gb.setConstraints$java_awt_Component$java_awt_GridBagConstraints(this.show, c);
this.add$java_awt_Component(this.show);
var blank2=Clazz.new_($I$(2).c$$S,["         "]);
c.gridx=4;
gb.setConstraints$java_awt_Component$java_awt_GridBagConstraints(blank2, c);
this.add$java_awt_Component(blank2);
this.reset=Clazz.new_($I$(8));
this.reset.addItem$S("Slow");
this.reset.addItem$S("Medium");
this.reset.addItem$S("Fast");
this.reset.addItem$S("RESET");
c.gridx=5;
c.gridwidth=1;
gb.setConstraints$java_awt_Component$java_awt_GridBagConstraints(this.reset, c);
this.add$java_awt_Component(this.reset);
this.reset.select$I(1);
var blankr=Clazz.new_($I$(2).c$$S,["        "]);
c.gridx=6;
gb.setConstraints$java_awt_Component$java_awt_GridBagConstraints(blankr, c);
this.add$java_awt_Component(blankr);
var temp=Clazz.new_($I$(10).c$$I,[2]);
temp.addElement$TE("Choose an associated curve");
temp.addElement$TE("from the list above left.");
this.textpanel=Clazz.new_($I$(11).c$$java_util_Vector,[temp]);
c=Clazz.new_($I$(9));
c.gridx=0;
c.gridy=0;
c.weightx=1;
c.weighty=1;
c.fill=1;
tcgb.setConstraints$java_awt_Component$java_awt_GridBagConstraints(this.textpanel, c);
this.textcard.add$java_awt_Component(this.textpanel);
this.textcard.validate$();
c=Clazz.new_($I$(9));
c.anchor=10;
c.insets=Clazz.new_($I$(12).c$$I$I$I$I,[1, 1, 1, 1]);
c.weightx=1;
c.weighty=1;
var blank3=Clazz.new_($I$(2).c$$S,["   "]);
c.gridx=4;
c.gridy=1;
c.fill=2;
ccgb.setConstraints$java_awt_Component$java_awt_GridBagConstraints(blank3, c);
this.controlcard.add$java_awt_Component(blank3);
var blank4=Clazz.new_($I$(2).c$$S,["      "]);
c.gridx=c.gridx + 2;
ccgb.setConstraints$java_awt_Component$java_awt_GridBagConstraints(blank4, c);
this.controlcard.add$java_awt_Component(blank4);
c.fill=0;
this.zoomin=Clazz.new_($I$(13).c$$S,["+10%"]);
c.gridx=c.gridx - 1;
c.gridy=Math.max(1, numberofparameters - 2);
ccgb.setConstraints$java_awt_Component$java_awt_GridBagConstraints(this.zoomin, c);
this.controlcard.add$java_awt_Component(this.zoomin);
this.nozoom=Clazz.new_($I$(13).c$$S,["100%"]);
c.gridy=c.gridy + 1;
ccgb.setConstraints$java_awt_Component$java_awt_GridBagConstraints(this.nozoom, c);
this.controlcard.add$java_awt_Component(this.nozoom);
this.zoomout=Clazz.new_($I$(13).c$$S,["-10%"]);
c.gridy=c.gridy + 1;
ccgb.setConstraints$java_awt_Component$java_awt_GridBagConstraints(this.zoomout, c);
this.controlcard.add$java_awt_Component(this.zoomout);
this.up=Clazz.new_($I$(1).c$$S$I,["North", 10]);
c.gridx=c.gridx + 3;
c.gridy=c.gridy - 2;
ccgb.setConstraints$java_awt_Component$java_awt_GridBagConstraints(this.up, c);
this.controlcard.add$java_awt_Component(this.up);
this.left=Clazz.new_($I$(1).c$$S$I,["West", 10]);
c.gridx=c.gridx - 1;
c.gridy=c.gridy + 1;
ccgb.setConstraints$java_awt_Component$java_awt_GridBagConstraints(this.left, c);
this.controlcard.add$java_awt_Component(this.left);
this.right=Clazz.new_($I$(1).c$$S$I,["East", 10]);
c.gridx=c.gridx + 2;
ccgb.setConstraints$java_awt_Component$java_awt_GridBagConstraints(this.right, c);
this.controlcard.add$java_awt_Component(this.right);
this.down=Clazz.new_($I$(1).c$$S$I,["South", 10]);
c.gridx=c.gridx - 1;
c.gridy=c.gridy + 1;
ccgb.setConstraints$java_awt_Component$java_awt_GridBagConstraints(this.down, c);
this.controlcard.add$java_awt_Component(this.down);
this.centre=Clazz.new_($I$(1).c$$S$I,["Square", 10]);
c.gridy=c.gridy - 1;
ccgb.setConstraints$java_awt_Component$java_awt_GridBagConstraints(this.centre, c);
this.controlcard.add$java_awt_Component(this.centre);
this.setMouseListeners$();
c.gridy=Math.max(3, numberofparameters);
c.gridwidth=1;
c.gridheight=1;
c.fill=0;
if (numberofparameters > 0) {
c.anchor=10;
c.gridx=3;
ccgb.setConstraints$java_awt_Component$java_awt_GridBagConstraints(this.pidown, c);
this.controlcard.add$java_awt_Component(this.pidown);
c.gridy-=2;
ccgb.setConstraints$java_awt_Component$java_awt_GridBagConstraints(this.piup, c);
this.controlcard.add$java_awt_Component(this.piup);
c.gridy++;
c.fill=2;
this.pilabel.setText$S("  inc=" + new Double(this.paramincrement).toString() + "  " );
ccgb.setConstraints$java_awt_Component$java_awt_GridBagConstraints(this.pilabel, c);
this.controlcard.add$java_awt_Component(this.pilabel);
c.gridy++;
}if (pp) {
this.plabel.setText$S("  p=" + new Double(curvepanel.curve.p).toString() + "  " );
c.gridx=0;
ccgb.setConstraints$java_awt_Component$java_awt_GridBagConstraints(this.pleft, c);
this.controlcard.add$java_awt_Component(this.pleft);
c.gridx=1;
ccgb.setConstraints$java_awt_Component$java_awt_GridBagConstraints(this.plabel, c);
this.controlcard.add$java_awt_Component(this.plabel);
c.gridx=2;
ccgb.setConstraints$java_awt_Component$java_awt_GridBagConstraints(this.pright, c);
this.controlcard.add$java_awt_Component(this.pright);
c.gridy--;
}if (np) {
this.nlabel.setText$S("  n=" + new Double(curvepanel.curve.n).toString() + "  " );
c.gridx=0;
ccgb.setConstraints$java_awt_Component$java_awt_GridBagConstraints(this.nleft, c);
this.controlcard.add$java_awt_Component(this.nleft);
c.gridx=1;
ccgb.setConstraints$java_awt_Component$java_awt_GridBagConstraints(this.nlabel, c);
this.controlcard.add$java_awt_Component(this.nlabel);
c.gridx=2;
ccgb.setConstraints$java_awt_Component$java_awt_GridBagConstraints(this.nright, c);
this.controlcard.add$java_awt_Component(this.nright);
c.gridy--;
}if (mp) {
this.mlabel.setText$S("  m=" + new Double(curvepanel.curve.m).toString() + "  " );
c.gridx=0;
ccgb.setConstraints$java_awt_Component$java_awt_GridBagConstraints(this.mleft, c);
this.controlcard.add$java_awt_Component(this.mleft);
c.gridx=1;
ccgb.setConstraints$java_awt_Component$java_awt_GridBagConstraints(this.mlabel, c);
this.controlcard.add$java_awt_Component(this.mlabel);
c.gridx=2;
ccgb.setConstraints$java_awt_Component$java_awt_GridBagConstraints(this.mright, c);
this.controlcard.add$java_awt_Component(this.mright);
c.gridy--;
}if (kp) {
this.klabel.setText$S("  k=" + new Double(curvepanel.curve.k).toString() + "  " );
c.gridx=0;
ccgb.setConstraints$java_awt_Component$java_awt_GridBagConstraints(this.kleft, c);
this.controlcard.add$java_awt_Component(this.kleft);
c.gridx=1;
ccgb.setConstraints$java_awt_Component$java_awt_GridBagConstraints(this.klabel, c);
this.controlcard.add$java_awt_Component(this.klabel);
c.gridx=2;
ccgb.setConstraints$java_awt_Component$java_awt_GridBagConstraints(this.kright, c);
this.controlcard.add$java_awt_Component(this.kright);
c.gridy--;
}if (hp) {
this.hlabel.setText$S("  h=" + new Double(curvepanel.curve.h).toString() + "  " );
c.gridx=0;
ccgb.setConstraints$java_awt_Component$java_awt_GridBagConstraints(this.hleft, c);
this.controlcard.add$java_awt_Component(this.hleft);
c.gridx=1;
ccgb.setConstraints$java_awt_Component$java_awt_GridBagConstraints(this.hlabel, c);
this.controlcard.add$java_awt_Component(this.hlabel);
c.gridx=2;
ccgb.setConstraints$java_awt_Component$java_awt_GridBagConstraints(this.hright, c);
this.controlcard.add$java_awt_Component(this.hright);
c.gridy--;
}if (fp) {
this.flabel.setText$S("  f=" + new Double(curvepanel.curve.f).toString() + "  " );
c.gridx=0;
ccgb.setConstraints$java_awt_Component$java_awt_GridBagConstraints(this.fleft, c);
this.controlcard.add$java_awt_Component(this.fleft);
c.gridx=1;
ccgb.setConstraints$java_awt_Component$java_awt_GridBagConstraints(this.flabel, c);
this.controlcard.add$java_awt_Component(this.flabel);
c.gridx=2;
ccgb.setConstraints$java_awt_Component$java_awt_GridBagConstraints(this.fright, c);
this.controlcard.add$java_awt_Component(this.fright);
c.gridy--;
}if (ep) {
this.elabel.setText$S("  e=" + new Double(curvepanel.curve.e).toString() + "  " );
c.gridx=0;
ccgb.setConstraints$java_awt_Component$java_awt_GridBagConstraints(this.eleft, c);
this.controlcard.add$java_awt_Component(this.eleft);
c.gridx=1;
ccgb.setConstraints$java_awt_Component$java_awt_GridBagConstraints(this.elabel, c);
this.controlcard.add$java_awt_Component(this.elabel);
c.gridx=2;
ccgb.setConstraints$java_awt_Component$java_awt_GridBagConstraints(this.eright, c);
this.controlcard.add$java_awt_Component(this.eright);
c.gridy--;
}if (dp) {
this.dlabel.setText$S("  d=" + new Double(curvepanel.curve.d).toString() + "  " );
c.gridx=0;
ccgb.setConstraints$java_awt_Component$java_awt_GridBagConstraints(this.dleft, c);
this.controlcard.add$java_awt_Component(this.dleft);
c.gridx=1;
ccgb.setConstraints$java_awt_Component$java_awt_GridBagConstraints(this.dlabel, c);
this.controlcard.add$java_awt_Component(this.dlabel);
c.gridx=2;
ccgb.setConstraints$java_awt_Component$java_awt_GridBagConstraints(this.dright, c);
this.controlcard.add$java_awt_Component(this.dright);
c.gridy--;
}if (cp) {
this.clabel.setText$S("  c=" + new Double(curvepanel.curve.c).toString() + "  " );
c.gridx=0;
ccgb.setConstraints$java_awt_Component$java_awt_GridBagConstraints(this.cleft, c);
this.controlcard.add$java_awt_Component(this.cleft);
c.gridx=1;
ccgb.setConstraints$java_awt_Component$java_awt_GridBagConstraints(this.clabel, c);
this.controlcard.add$java_awt_Component(this.clabel);
c.gridx=2;
ccgb.setConstraints$java_awt_Component$java_awt_GridBagConstraints(this.cright, c);
this.controlcard.add$java_awt_Component(this.cright);
c.gridy--;
}if (bp) {
this.blabel.setText$S("  b=" + new Double(curvepanel.curve.b).toString() + "  " );
c.gridx=0;
ccgb.setConstraints$java_awt_Component$java_awt_GridBagConstraints(this.bleft, c);
this.controlcard.add$java_awt_Component(this.bleft);
c.gridx=1;
ccgb.setConstraints$java_awt_Component$java_awt_GridBagConstraints(this.blabel, c);
this.controlcard.add$java_awt_Component(this.blabel);
c.gridx=2;
ccgb.setConstraints$java_awt_Component$java_awt_GridBagConstraints(this.bright, c);
this.controlcard.add$java_awt_Component(this.bright);
c.gridy--;
}if (ap) {
this.alabel.setText$S("  a=" + new Double(curvepanel.curve.a).toString() + "  " );
c.gridx=0;
ccgb.setConstraints$java_awt_Component$java_awt_GridBagConstraints(this.aleft, c);
this.controlcard.add$java_awt_Component(this.aleft);
c.gridx=1;
ccgb.setConstraints$java_awt_Component$java_awt_GridBagConstraints(this.alabel, c);
this.controlcard.add$java_awt_Component(this.alabel);
c.gridx=2;
ccgb.setConstraints$java_awt_Component$java_awt_GridBagConstraints(this.aright, c);
this.controlcard.add$java_awt_Component(this.aright);
}this.controlcard.validate$();
this.cards.add$S$java_awt_Component("controlcard", this.controlcard);
this.cards.add$S$java_awt_Component("textcard", this.textcard);
this.cards.validate$();
c=Clazz.new_($I$(9));
c.gridx=1;
c.gridy=1;
c.gridwidth=5;
c.gridheight=2;
c.fill=1;
gb.setConstraints$java_awt_Component$java_awt_GridBagConstraints(this.cards, c);
this.add$java_awt_Component(this.cards);
this.validate$();
}, 1);

Clazz.newMeth(C$, 'paint$java_awt_Graphics', function (g) {
});

Clazz.newMeth(C$, 'action$java_awt_Event$O', function (e, arg) {
if (Clazz.instanceOf(e.target, "java.awt.Choice")) {
if (e.target === this.curvechoice ) {
var i=this.curvechoice.getSelectedIndex$();
switch (i) {
case 0:
break;
case 1:
this.curvepanel.associatedcurve=this.curvepanel.curve.evolutePixels$();
break;
case 2:
break;
case 3:
break;
case 4:
break;
case 5:
break;
case 6:
break;
case 7:
break;
}
if (this.showing == 0) {
this.printcontrols$();
} else if (this.showing == 1) {
this.printinstructions$I(i);
} else if (this.showing == 2) {
this.printdefinition$I(i);
}this.curvepanel.associatedcurveindex=i;
this.curvepanel.pointstage=0;
this.curvepanel.circlestage=0;
this.curvepanel.clear=true;
} else if (e.target === this.show ) {
this.showing=this.show.getSelectedIndex$();
switch (this.showing) {
case 0:
this.printcontrols$();
break;
case 1:
this.printinstructions$I(this.curvechoice.getSelectedIndex$());
break;
case 2:
this.printdefinition$I(this.curvechoice.getSelectedIndex$());
break;
}
} else if (e.target === this.reset ) {
switch (this.reset.getSelectedIndex$()) {
case 0:
this.curvepanel.steps=1;
break;
case 1:
this.curvepanel.steps=2;
break;
case 2:
this.curvepanel.steps=4;
break;
case 3:
this.curvepanel.resetCurveParameters$();
this.alabel.setText$S("a=" + new Double(this.curvepanel.curve.a).toString());
this.blabel.setText$S("b=" + new Double(this.curvepanel.curve.b).toString());
this.clabel.setText$S("c=" + new Double(this.curvepanel.curve.c).toString());
this.dlabel.setText$S("d=" + new Double(this.curvepanel.curve.d).toString());
this.elabel.setText$S("e=" + new Double(this.curvepanel.curve.e).toString());
this.flabel.setText$S("f=" + new Double(this.curvepanel.curve.f).toString());
this.hlabel.setText$S("h=" + new Double(this.curvepanel.curve.h).toString());
this.klabel.setText$S("k=" + new Double(this.curvepanel.curve.k).toString());
this.mlabel.setText$S("m=" + new Double(this.curvepanel.curve.m).toString());
this.nlabel.setText$S("n=" + new Double(this.curvepanel.curve.n).toString());
this.plabel.setText$S("p=" + new Double(this.curvepanel.curve.p).toString());
this.curvepanel.curve.setCurve$();
this.curvepanel.pointstage=0;
this.curvepanel.circlestage=0;
this.curvepanel.pointX=0;
this.curvepanel.pointY=0;
this.curvepanel.circleX=0;
this.curvepanel.circleY=0;
this.curvepanel.circleCX=0;
this.curvepanel.circleCY=0;
this.curvepanel.circleR=0;
this.curvepanel.associatedcurveindex=0;
this.curvepanel.clear=false;
this.curvepanel.setaxis=false;
this.curvepanel.steps=1;
this.reset.select$I(1);
this.showing=0;
this.show.select$I(0);
this.curvechoice.select$I(0);
this.printcontrols$();
break;
}
}} else if (Clazz.instanceOf(e.target, "java.awt.Button")) {
if (e.target === this.zoomin ) {
this.curvepanel.curve.scale$D(1.1);
this.curvepanel.scale$D(1.1);
} else if (e.target === this.zoomout ) {
this.curvepanel.curve.scale$D(0.9);
this.curvepanel.scale$D(0.9);
} else if (e.target === this.nozoom ) {
var sc=((this.curvepanel.size$().height / this.curvepanel.curve.yrange)|0);
var oldsc=$I$(14).xsc;
this.curvepanel.scale$D(sc / oldsc);
this.curvepanel.curve.scale$D(sc / oldsc);
}}if (e.target !== this.show ) {
this.curvepanel.recalculate$();
this.curvepanel.repaint$();
}return true;
});

Clazz.newMeth(C$, 'setMouseListeners$', function () {
this.up.addMouseListener$java_awt_event_MouseListener(((P$.CurveControls$1||
(function(){var C$=Clazz.newClass(P$, "CurveControls$1", function(){Clazz.newInstance(this, arguments[0],1,C$);}, Clazz.load('java.awt.event.MouseAdapter'), null, 1);

C$.$clinit$ = function() {Clazz.load(C$, 1);
}

Clazz.newMeth(C$, '$init$', function () {
}, 1);

Clazz.newMeth(C$, 'mouseReleased$java_awt_event_MouseEvent', function (e) {
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.curve.translate$I$I(0, -5);
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.translate$I$I(0, -5);
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.repaint$();
});
})()
), Clazz.new_($I$(15), [this, null],P$.CurveControls$1)));
this.down.addMouseListener$java_awt_event_MouseListener(((P$.CurveControls$2||
(function(){var C$=Clazz.newClass(P$, "CurveControls$2", function(){Clazz.newInstance(this, arguments[0],1,C$);}, Clazz.load('java.awt.event.MouseAdapter'), null, 1);

C$.$clinit$ = function() {Clazz.load(C$, 1);
}

Clazz.newMeth(C$, '$init$', function () {
}, 1);

Clazz.newMeth(C$, 'mouseReleased$java_awt_event_MouseEvent', function (e) {
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.curve.translate$I$I(0, 5);
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.translate$I$I(0, 5);
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.repaint$();
});
})()
), Clazz.new_($I$(15), [this, null],P$.CurveControls$2)));
this.left.addMouseListener$java_awt_event_MouseListener(((P$.CurveControls$3||
(function(){var C$=Clazz.newClass(P$, "CurveControls$3", function(){Clazz.newInstance(this, arguments[0],1,C$);}, Clazz.load('java.awt.event.MouseAdapter'), null, 1);

C$.$clinit$ = function() {Clazz.load(C$, 1);
}

Clazz.newMeth(C$, '$init$', function () {
}, 1);

Clazz.newMeth(C$, 'mouseReleased$java_awt_event_MouseEvent', function (e) {
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.curve.translate$I$I(-5, 0);
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.translate$I$I(-5, 0);
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.repaint$();
});
})()
), Clazz.new_($I$(15), [this, null],P$.CurveControls$3)));
this.right.addMouseListener$java_awt_event_MouseListener(((P$.CurveControls$4||
(function(){var C$=Clazz.newClass(P$, "CurveControls$4", function(){Clazz.newInstance(this, arguments[0],1,C$);}, Clazz.load('java.awt.event.MouseAdapter'), null, 1);

C$.$clinit$ = function() {Clazz.load(C$, 1);
}

Clazz.newMeth(C$, '$init$', function () {
}, 1);

Clazz.newMeth(C$, 'mouseReleased$java_awt_event_MouseEvent', function (e) {
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.curve.translate$I$I(5, 0);
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.translate$I$I(5, 0);
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.repaint$();
});
})()
), Clazz.new_($I$(15), [this, null],P$.CurveControls$4)));
this.centre.addMouseListener$java_awt_event_MouseListener(((P$.CurveControls$5||
(function(){var C$=Clazz.newClass(P$, "CurveControls$5", function(){Clazz.newInstance(this, arguments[0],1,C$);}, Clazz.load('java.awt.event.MouseAdapter'), null, 1);

C$.$clinit$ = function() {Clazz.load(C$, 1);
}

Clazz.newMeth(C$, '$init$', function () {
}, 1);

Clazz.newMeth(C$, 'mouseReleased$java_awt_event_MouseEvent', function (e) {
var tx=$I$(14).Ox;
var ty=$I$(14).Oy;
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.curve.translate$I$I(((this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.size$().width/2|0) - tx), ((this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.size$().height/2|0) - ty));
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.translate$I$I(((this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.size$().width/2|0) - tx), ((this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.size$().height/2|0) - ty));
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.repaint$();
});
})()
), Clazz.new_($I$(15), [this, null],P$.CurveControls$5)));
this.pidown.addMouseListener$java_awt_event_MouseListener(((P$.CurveControls$6||
(function(){var C$=Clazz.newClass(P$, "CurveControls$6", function(){Clazz.newInstance(this, arguments[0],1,C$);}, Clazz.load('java.awt.event.MouseAdapter'), null, 1);

C$.$clinit$ = function() {Clazz.load(C$, 1);
}

Clazz.newMeth(C$, '$init$', function () {
}, 1);

Clazz.newMeth(C$, 'mouseReleased$java_awt_event_MouseEvent', function (e) {
if (Math.abs(this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].paramincrement) > 10 ) {
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].paramincrement -= 10;
} else if (Math.abs(this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].paramincrement) > 1 ) {
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].paramincrement -= 1;
} else if (Math.abs(this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].paramincrement) > 0 ) {
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].paramincrement -= 0.1;
}if (Math.abs(this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].paramincrement) < 0.05 ) {
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].paramincrement=0.0;
}this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].pilabel.setText$S("inc=" + P$.CurveControls.fD$D(this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].paramincrement));
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].pidown.repaint$();
});
})()
), Clazz.new_($I$(15), [this, null],P$.CurveControls$6)));
this.piup.addMouseListener$java_awt_event_MouseListener(((P$.CurveControls$7||
(function(){var C$=Clazz.newClass(P$, "CurveControls$7", function(){Clazz.newInstance(this, arguments[0],1,C$);}, Clazz.load('java.awt.event.MouseAdapter'), null, 1);

C$.$clinit$ = function() {Clazz.load(C$, 1);
}

Clazz.newMeth(C$, '$init$', function () {
}, 1);

Clazz.newMeth(C$, 'mouseReleased$java_awt_event_MouseEvent', function (e) {
if (Math.abs(this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].paramincrement) > 9 ) {
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].paramincrement += 10;
} else if (Math.abs(this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].paramincrement) >= 0.9 ) {
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].paramincrement += 1;
} else {
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].paramincrement += 0.1;
}if (Math.abs(this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].paramincrement) < 0.05 ) {
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].paramincrement=0.0;
}this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].pilabel.setText$S("inc=" + P$.CurveControls.fD$D(this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].paramincrement));
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].piup.repaint$();
});
})()
), Clazz.new_($I$(15), [this, null],P$.CurveControls$7)));
this.aleft.addMouseListener$java_awt_event_MouseListener(((P$.CurveControls$8||
(function(){var C$=Clazz.newClass(P$, "CurveControls$8", function(){Clazz.newInstance(this, arguments[0],1,C$);}, Clazz.load('java.awt.event.MouseAdapter'), null, 1);

C$.$clinit$ = function() {Clazz.load(C$, 1);
}

Clazz.newMeth(C$, '$init$', function () {
}, 1);

Clazz.newMeth(C$, 'mouseReleased$java_awt_event_MouseEvent', function (e) {
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.curve.a -= this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].paramincrement;
if (Math.abs(this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.curve.a) < 0.05 ) {
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.curve.a=0.0;
}this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.curve.setCurve$();
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].alabel.setText$S("a=" + P$.CurveControls.fD$D(this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.curve.a));
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.curve.translate$I$I(0, 0);
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.translate$I$I(0, 0);
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.repaint$();
});
})()
), Clazz.new_($I$(15), [this, null],P$.CurveControls$8)));
this.aright.addMouseListener$java_awt_event_MouseListener(((P$.CurveControls$9||
(function(){var C$=Clazz.newClass(P$, "CurveControls$9", function(){Clazz.newInstance(this, arguments[0],1,C$);}, Clazz.load('java.awt.event.MouseAdapter'), null, 1);

C$.$clinit$ = function() {Clazz.load(C$, 1);
}

Clazz.newMeth(C$, '$init$', function () {
}, 1);

Clazz.newMeth(C$, 'mouseReleased$java_awt_event_MouseEvent', function (e) {
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.curve.a += this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].paramincrement;
if (Math.abs(this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.curve.a) < 0.05 ) {
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.curve.a=0.0;
}this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.curve.setCurve$();
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].alabel.setText$S("a=" + P$.CurveControls.fD$D(this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.curve.a));
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.curve.translate$I$I(0, 0);
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.translate$I$I(0, 0);
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].aright.repaint$();
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.repaint$();
});
})()
), Clazz.new_($I$(15), [this, null],P$.CurveControls$9)));
this.bleft.addMouseListener$java_awt_event_MouseListener(((P$.CurveControls$10||
(function(){var C$=Clazz.newClass(P$, "CurveControls$10", function(){Clazz.newInstance(this, arguments[0],1,C$);}, Clazz.load('java.awt.event.MouseAdapter'), null, 1);

C$.$clinit$ = function() {Clazz.load(C$, 1);
}

Clazz.newMeth(C$, '$init$', function () {
}, 1);

Clazz.newMeth(C$, 'mouseReleased$java_awt_event_MouseEvent', function (e) {
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.curve.b -= this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].paramincrement;
if (Math.abs(this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.curve.b) < 0.05 ) {
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.curve.b=0.0;
}this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.curve.setCurve$();
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].blabel.setText$S("b=" + P$.CurveControls.fD$D(this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.curve.b));
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.curve.translate$I$I(0, 0);
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.translate$I$I(0, 0);
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].bleft.repaint$();
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.repaint$();
});
})()
), Clazz.new_($I$(15), [this, null],P$.CurveControls$10)));
this.bright.addMouseListener$java_awt_event_MouseListener(((P$.CurveControls$11||
(function(){var C$=Clazz.newClass(P$, "CurveControls$11", function(){Clazz.newInstance(this, arguments[0],1,C$);}, Clazz.load('java.awt.event.MouseAdapter'), null, 1);

C$.$clinit$ = function() {Clazz.load(C$, 1);
}

Clazz.newMeth(C$, '$init$', function () {
}, 1);

Clazz.newMeth(C$, 'mouseReleased$java_awt_event_MouseEvent', function (e) {
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.curve.b += this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].paramincrement;
if (Math.abs(this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.curve.b) < 0.05 ) {
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.curve.b=0.0;
}this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.curve.setCurve$();
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].blabel.setText$S("b=" + P$.CurveControls.fD$D(this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.curve.b));
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.curve.translate$I$I(0, 0);
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.translate$I$I(0, 0);
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].bright.repaint$();
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.repaint$();
});
})()
), Clazz.new_($I$(15), [this, null],P$.CurveControls$11)));
this.cleft.addMouseListener$java_awt_event_MouseListener(((P$.CurveControls$12||
(function(){var C$=Clazz.newClass(P$, "CurveControls$12", function(){Clazz.newInstance(this, arguments[0],1,C$);}, Clazz.load('java.awt.event.MouseAdapter'), null, 1);

C$.$clinit$ = function() {Clazz.load(C$, 1);
}

Clazz.newMeth(C$, '$init$', function () {
}, 1);

Clazz.newMeth(C$, 'mouseReleased$java_awt_event_MouseEvent', function (e) {
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.curve.c -= this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].paramincrement;
if (Math.abs(this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.curve.c) < 0.05 ) {
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.curve.c=0.0;
}this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.curve.setCurve$();
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].clabel.setText$S("c=" + P$.CurveControls.fD$D(this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.curve.c));
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.curve.translate$I$I(0, 0);
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.translate$I$I(0, 0);
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].cright.repaint$();
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.repaint$();
});
})()
), Clazz.new_($I$(15), [this, null],P$.CurveControls$12)));
this.cright.addMouseListener$java_awt_event_MouseListener(((P$.CurveControls$13||
(function(){var C$=Clazz.newClass(P$, "CurveControls$13", function(){Clazz.newInstance(this, arguments[0],1,C$);}, Clazz.load('java.awt.event.MouseAdapter'), null, 1);

C$.$clinit$ = function() {Clazz.load(C$, 1);
}

Clazz.newMeth(C$, '$init$', function () {
}, 1);

Clazz.newMeth(C$, 'mouseReleased$java_awt_event_MouseEvent', function (e) {
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.curve.c += this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].paramincrement;
if (Math.abs(this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.curve.c) < 0.05 ) {
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.curve.c=0.0;
}this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.curve.setCurve$();
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].clabel.setText$S("c=" + P$.CurveControls.fD$D(this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.curve.c));
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.curve.translate$I$I(0, 0);
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.translate$I$I(0, 0);
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].cright.repaint$();
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.repaint$();
});
})()
), Clazz.new_($I$(15), [this, null],P$.CurveControls$13)));
this.dleft.addMouseListener$java_awt_event_MouseListener(((P$.CurveControls$14||
(function(){var C$=Clazz.newClass(P$, "CurveControls$14", function(){Clazz.newInstance(this, arguments[0],1,C$);}, Clazz.load('java.awt.event.MouseAdapter'), null, 1);

C$.$clinit$ = function() {Clazz.load(C$, 1);
}

Clazz.newMeth(C$, '$init$', function () {
}, 1);

Clazz.newMeth(C$, 'mouseReleased$java_awt_event_MouseEvent', function (e) {
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.curve.d -= this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].paramincrement;
if (Math.abs(this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.curve.d) < 0.05 ) {
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.curve.d=0.0;
}this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.curve.setCurve$();
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].dlabel.setText$S("d=" + P$.CurveControls.fD$D(this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.curve.d));
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.curve.translate$I$I(0, 0);
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.translate$I$I(0, 0);
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].dright.repaint$();
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.repaint$();
});
})()
), Clazz.new_($I$(15), [this, null],P$.CurveControls$14)));
this.dright.addMouseListener$java_awt_event_MouseListener(((P$.CurveControls$15||
(function(){var C$=Clazz.newClass(P$, "CurveControls$15", function(){Clazz.newInstance(this, arguments[0],1,C$);}, Clazz.load('java.awt.event.MouseAdapter'), null, 1);

C$.$clinit$ = function() {Clazz.load(C$, 1);
}

Clazz.newMeth(C$, '$init$', function () {
}, 1);

Clazz.newMeth(C$, 'mouseReleased$java_awt_event_MouseEvent', function (e) {
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.curve.d += this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].paramincrement;
if (Math.abs(this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.curve.d) < 0.05 ) {
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.curve.d=0.0;
}this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.curve.setCurve$();
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].dlabel.setText$S("d=" + P$.CurveControls.fD$D(this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.curve.d));
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.curve.translate$I$I(0, 0);
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.translate$I$I(0, 0);
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].dright.repaint$();
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.repaint$();
});
})()
), Clazz.new_($I$(15), [this, null],P$.CurveControls$15)));
this.eleft.addMouseListener$java_awt_event_MouseListener(((P$.CurveControls$16||
(function(){var C$=Clazz.newClass(P$, "CurveControls$16", function(){Clazz.newInstance(this, arguments[0],1,C$);}, Clazz.load('java.awt.event.MouseAdapter'), null, 1);

C$.$clinit$ = function() {Clazz.load(C$, 1);
}

Clazz.newMeth(C$, '$init$', function () {
}, 1);

Clazz.newMeth(C$, 'mouseReleased$java_awt_event_MouseEvent', function (e) {
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.curve.e -= this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].paramincrement;
if (Math.abs(this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.curve.e) < 0.05 ) {
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.curve.e=0.0;
}this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.curve.setCurve$();
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].elabel.setText$S("e=" + P$.CurveControls.fD$D(this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.curve.e));
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.curve.translate$I$I(0, 0);
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.translate$I$I(0, 0);
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].eright.repaint$();
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.repaint$();
});
})()
), Clazz.new_($I$(15), [this, null],P$.CurveControls$16)));
this.eright.addMouseListener$java_awt_event_MouseListener(((P$.CurveControls$17||
(function(){var C$=Clazz.newClass(P$, "CurveControls$17", function(){Clazz.newInstance(this, arguments[0],1,C$);}, Clazz.load('java.awt.event.MouseAdapter'), null, 1);

C$.$clinit$ = function() {Clazz.load(C$, 1);
}

Clazz.newMeth(C$, '$init$', function () {
}, 1);

Clazz.newMeth(C$, 'mouseReleased$java_awt_event_MouseEvent', function (e) {
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.curve.e += this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].paramincrement;
if (Math.abs(this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.curve.e) < 0.05 ) {
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.curve.e=0.0;
}this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.curve.setCurve$();
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].elabel.setText$S("e=" + P$.CurveControls.fD$D(this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.curve.e));
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.curve.translate$I$I(0, 0);
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.translate$I$I(0, 0);
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].eright.repaint$();
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.repaint$();
});
})()
), Clazz.new_($I$(15), [this, null],P$.CurveControls$17)));
this.fleft.addMouseListener$java_awt_event_MouseListener(((P$.CurveControls$18||
(function(){var C$=Clazz.newClass(P$, "CurveControls$18", function(){Clazz.newInstance(this, arguments[0],1,C$);}, Clazz.load('java.awt.event.MouseAdapter'), null, 1);

C$.$clinit$ = function() {Clazz.load(C$, 1);
}

Clazz.newMeth(C$, '$init$', function () {
}, 1);

Clazz.newMeth(C$, 'mouseReleased$java_awt_event_MouseEvent', function (e) {
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.curve.f -= this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].paramincrement;
if (Math.abs(this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.curve.f) < 0.05 ) {
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.curve.f=0.0;
}this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.curve.setCurve$();
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].flabel.setText$S("f=" + P$.CurveControls.fD$D(this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.curve.f));
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.curve.translate$I$I(0, 0);
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.translate$I$I(0, 0);
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].fright.repaint$();
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.repaint$();
});
})()
), Clazz.new_($I$(15), [this, null],P$.CurveControls$18)));
this.fright.addMouseListener$java_awt_event_MouseListener(((P$.CurveControls$19||
(function(){var C$=Clazz.newClass(P$, "CurveControls$19", function(){Clazz.newInstance(this, arguments[0],1,C$);}, Clazz.load('java.awt.event.MouseAdapter'), null, 1);

C$.$clinit$ = function() {Clazz.load(C$, 1);
}

Clazz.newMeth(C$, '$init$', function () {
}, 1);

Clazz.newMeth(C$, 'mouseReleased$java_awt_event_MouseEvent', function (e) {
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.curve.f += this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].paramincrement;
if (Math.abs(this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.curve.f) < 0.05 ) {
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.curve.f=0.0;
}this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.curve.setCurve$();
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].flabel.setText$S("f=" + P$.CurveControls.fD$D(this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.curve.f));
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.curve.translate$I$I(0, 0);
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.translate$I$I(0, 0);
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].fright.repaint$();
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.repaint$();
});
})()
), Clazz.new_($I$(15), [this, null],P$.CurveControls$19)));
this.hleft.addMouseListener$java_awt_event_MouseListener(((P$.CurveControls$20||
(function(){var C$=Clazz.newClass(P$, "CurveControls$20", function(){Clazz.newInstance(this, arguments[0],1,C$);}, Clazz.load('java.awt.event.MouseAdapter'), null, 1);

C$.$clinit$ = function() {Clazz.load(C$, 1);
}

Clazz.newMeth(C$, '$init$', function () {
}, 1);

Clazz.newMeth(C$, 'mouseReleased$java_awt_event_MouseEvent', function (e) {
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.curve.h -= this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].paramincrement;
if (Math.abs(this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.curve.h) < 0.05 ) {
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.curve.h=0.0;
}this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.curve.setCurve$();
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].hlabel.setText$S("h=" + P$.CurveControls.fD$D(this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.curve.h));
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.curve.translate$I$I(0, 0);
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.translate$I$I(0, 0);
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].hright.repaint$();
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.repaint$();
});
})()
), Clazz.new_($I$(15), [this, null],P$.CurveControls$20)));
this.hright.addMouseListener$java_awt_event_MouseListener(((P$.CurveControls$21||
(function(){var C$=Clazz.newClass(P$, "CurveControls$21", function(){Clazz.newInstance(this, arguments[0],1,C$);}, Clazz.load('java.awt.event.MouseAdapter'), null, 1);

C$.$clinit$ = function() {Clazz.load(C$, 1);
}

Clazz.newMeth(C$, '$init$', function () {
}, 1);

Clazz.newMeth(C$, 'mouseReleased$java_awt_event_MouseEvent', function (e) {
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.curve.h += this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].paramincrement;
if (Math.abs(this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.curve.h) < 0.05 ) {
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.curve.h=0.0;
}this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.curve.setCurve$();
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].hlabel.setText$S("h=" + P$.CurveControls.fD$D(this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.curve.h));
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.curve.translate$I$I(0, 0);
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.translate$I$I(0, 0);
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].hright.repaint$();
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.repaint$();
});
})()
), Clazz.new_($I$(15), [this, null],P$.CurveControls$21)));
this.kleft.addMouseListener$java_awt_event_MouseListener(((P$.CurveControls$22||
(function(){var C$=Clazz.newClass(P$, "CurveControls$22", function(){Clazz.newInstance(this, arguments[0],1,C$);}, Clazz.load('java.awt.event.MouseAdapter'), null, 1);

C$.$clinit$ = function() {Clazz.load(C$, 1);
}

Clazz.newMeth(C$, '$init$', function () {
}, 1);

Clazz.newMeth(C$, 'mouseReleased$java_awt_event_MouseEvent', function (e) {
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.curve.k -= this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].paramincrement;
if (Math.abs(this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.curve.k) < 0.05 ) {
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.curve.k=0.0;
}this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.curve.setCurve$();
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].klabel.setText$S("k=" + P$.CurveControls.fD$D(this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.curve.k));
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.curve.translate$I$I(0, 0);
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.translate$I$I(0, 0);
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].kright.repaint$();
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.repaint$();
});
})()
), Clazz.new_($I$(15), [this, null],P$.CurveControls$22)));
this.kright.addMouseListener$java_awt_event_MouseListener(((P$.CurveControls$23||
(function(){var C$=Clazz.newClass(P$, "CurveControls$23", function(){Clazz.newInstance(this, arguments[0],1,C$);}, Clazz.load('java.awt.event.MouseAdapter'), null, 1);

C$.$clinit$ = function() {Clazz.load(C$, 1);
}

Clazz.newMeth(C$, '$init$', function () {
}, 1);

Clazz.newMeth(C$, 'mouseReleased$java_awt_event_MouseEvent', function (e) {
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.curve.k += this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].paramincrement;
if (Math.abs(this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.curve.k) < 0.05 ) {
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.curve.k=0.0;
}this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.curve.setCurve$();
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].klabel.setText$S("k=" + P$.CurveControls.fD$D(this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.curve.k));
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.curve.translate$I$I(0, 0);
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.translate$I$I(0, 0);
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].kright.repaint$();
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.repaint$();
});
})()
), Clazz.new_($I$(15), [this, null],P$.CurveControls$23)));
this.mleft.addMouseListener$java_awt_event_MouseListener(((P$.CurveControls$24||
(function(){var C$=Clazz.newClass(P$, "CurveControls$24", function(){Clazz.newInstance(this, arguments[0],1,C$);}, Clazz.load('java.awt.event.MouseAdapter'), null, 1);

C$.$clinit$ = function() {Clazz.load(C$, 1);
}

Clazz.newMeth(C$, '$init$', function () {
}, 1);

Clazz.newMeth(C$, 'mouseReleased$java_awt_event_MouseEvent', function (e) {
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.curve.m -= this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].paramincrement;
if (Math.abs(this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.curve.m) < 0.05 ) {
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.curve.m=0.0;
}this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.curve.setCurve$();
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].mlabel.setText$S("m=" + P$.CurveControls.fD$D(this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.curve.m));
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.curve.translate$I$I(0, 0);
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.translate$I$I(0, 0);
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].mright.repaint$();
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.repaint$();
});
})()
), Clazz.new_($I$(15), [this, null],P$.CurveControls$24)));
this.mright.addMouseListener$java_awt_event_MouseListener(((P$.CurveControls$25||
(function(){var C$=Clazz.newClass(P$, "CurveControls$25", function(){Clazz.newInstance(this, arguments[0],1,C$);}, Clazz.load('java.awt.event.MouseAdapter'), null, 1);

C$.$clinit$ = function() {Clazz.load(C$, 1);
}

Clazz.newMeth(C$, '$init$', function () {
}, 1);

Clazz.newMeth(C$, 'mouseReleased$java_awt_event_MouseEvent', function (e) {
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.curve.m += this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].paramincrement;
if (Math.abs(this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.curve.m) < 0.05 ) {
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.curve.m=0.0;
}this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.curve.setCurve$();
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].mlabel.setText$S("m=" + P$.CurveControls.fD$D(this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.curve.m));
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.curve.translate$I$I(0, 0);
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.translate$I$I(0, 0);
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].mright.repaint$();
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.repaint$();
});
})()
), Clazz.new_($I$(15), [this, null],P$.CurveControls$25)));
this.nleft.addMouseListener$java_awt_event_MouseListener(((P$.CurveControls$26||
(function(){var C$=Clazz.newClass(P$, "CurveControls$26", function(){Clazz.newInstance(this, arguments[0],1,C$);}, Clazz.load('java.awt.event.MouseAdapter'), null, 1);

C$.$clinit$ = function() {Clazz.load(C$, 1);
}

Clazz.newMeth(C$, '$init$', function () {
}, 1);

Clazz.newMeth(C$, 'mouseReleased$java_awt_event_MouseEvent', function (e) {
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.curve.n -= this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].paramincrement;
if (Math.abs(this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.curve.n) < 0.05 ) {
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.curve.n=0.0;
}this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.curve.setCurve$();
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].nlabel.setText$S("n=" + P$.CurveControls.fD$D(this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.curve.n));
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.curve.translate$I$I(0, 0);
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.translate$I$I(0, 0);
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].nright.repaint$();
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.repaint$();
});
})()
), Clazz.new_($I$(15), [this, null],P$.CurveControls$26)));
this.nright.addMouseListener$java_awt_event_MouseListener(((P$.CurveControls$27||
(function(){var C$=Clazz.newClass(P$, "CurveControls$27", function(){Clazz.newInstance(this, arguments[0],1,C$);}, Clazz.load('java.awt.event.MouseAdapter'), null, 1);

C$.$clinit$ = function() {Clazz.load(C$, 1);
}

Clazz.newMeth(C$, '$init$', function () {
}, 1);

Clazz.newMeth(C$, 'mouseReleased$java_awt_event_MouseEvent', function (e) {
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.curve.n += this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].paramincrement;
if (Math.abs(this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.curve.n) < 0.05 ) {
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.curve.n=0.0;
}this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.curve.setCurve$();
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].nlabel.setText$S("n=" + P$.CurveControls.fD$D(this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.curve.n));
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.curve.translate$I$I(0, 0);
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.translate$I$I(0, 0);
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].nright.repaint$();
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.repaint$();
});
})()
), Clazz.new_($I$(15), [this, null],P$.CurveControls$27)));
this.pleft.addMouseListener$java_awt_event_MouseListener(((P$.CurveControls$28||
(function(){var C$=Clazz.newClass(P$, "CurveControls$28", function(){Clazz.newInstance(this, arguments[0],1,C$);}, Clazz.load('java.awt.event.MouseAdapter'), null, 1);

C$.$clinit$ = function() {Clazz.load(C$, 1);
}

Clazz.newMeth(C$, '$init$', function () {
}, 1);

Clazz.newMeth(C$, 'mouseReleased$java_awt_event_MouseEvent', function (e) {
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.curve.p -= this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].paramincrement;
if (Math.abs(this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.curve.p) < 0.05 ) {
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.curve.p=0.0;
}this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.curve.setCurve$();
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].plabel.setText$S("p=" + P$.CurveControls.fD$D(this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.curve.p));
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.curve.translate$I$I(0, 0);
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.translate$I$I(0, 0);
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].pright.repaint$();
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.repaint$();
});
})()
), Clazz.new_($I$(15), [this, null],P$.CurveControls$28)));
this.pright.addMouseListener$java_awt_event_MouseListener(((P$.CurveControls$29||
(function(){var C$=Clazz.newClass(P$, "CurveControls$29", function(){Clazz.newInstance(this, arguments[0],1,C$);}, Clazz.load('java.awt.event.MouseAdapter'), null, 1);

C$.$clinit$ = function() {Clazz.load(C$, 1);
}

Clazz.newMeth(C$, '$init$', function () {
}, 1);

Clazz.newMeth(C$, 'mouseReleased$java_awt_event_MouseEvent', function (e) {
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.curve.p += this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].paramincrement;
if (Math.abs(this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.curve.p) < 0.05 ) {
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.curve.p=0.0;
}this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.curve.setCurve$();
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].plabel.setText$S("p=" + P$.CurveControls.fD$D(this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.curve.p));
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.curve.translate$I$I(0, 0);
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.translate$I$I(0, 0);
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].pright.repaint$();
this.b$['uk.ac.stand.mcs.wwwhistory.famouscurves.CurveControls'].curvepanel.repaint$();
});
})()
), Clazz.new_($I$(15), [this, null],P$.CurveControls$29)));
});

Clazz.newMeth(C$, 'printdefinition$I', function (i) {
this.textpanel.setColor$java_awt_Color(Clazz.new_($I$(3).c$$I$I$I,[160, 0, 0]));
(this.cards.getLayout$()).show$java_awt_Container$S(this.cards, "textcard");
var temp=Clazz.new_($I$(10));
switch (i) {
case 0:
temp.addElement$TE("The equation of the curve is given below.");
break;
case 1:
temp.addElement$TE("The Evolute is the envelope of");
temp.addElement$TE("the normals to a given curve.");
break;
case 2:
temp.addElement$TE("If C is a curve, and C\' is its envolute,");
temp.addElement$TE("then C is called an Involute of C\'.");
break;
case 3:
temp.addElement$TE("Given a circle C with centre O and radius r then");
temp.addElement$TE("two points P & Q are inverse wrt C if OP.OQ=r.");
temp.addElement$TE("If P describes a curve C1 then Q describes a curve C2");
temp.addElement$TE("called the Inverse of C1 wrt the circle C");
break;
case 4:
temp.addElement$TE("The Pedal Curve of C wrt a fixed \"pedal point\" O is");
temp.addElement$TE("the locus of the point P of intersection of");
temp.addElement$TE("the perpendicular from O to a tangent to C.");
break;
case 5:
temp.addElement$TE("Given a curve C and a fixed point O then for a point");
temp.addElement$TE("P on C draw a line perpendicular to OP.");
temp.addElement$TE("The envelope of these lines as P describes C is");
temp.addElement$TE("the negative pedal of C.");
break;
case 6:
temp.addElement$TE("When light reflects off a curve then the envelope of");
temp.addElement$TE("the reflected rays is a caustic.");
temp.addElement$TE("These light rays are radial to the chosen point.");
break;
case 7:
temp.addElement$TE("When light reflects off a curve then the envelope of");
temp.addElement$TE("the reflected rays is a caustic.");
temp.addElement$TE("These light rays are parallel to the chosen line.");
break;
}
this.textpanel.setText$java_util_Vector(temp);
this.textpanel.setFontSize$I(12);
});

Clazz.newMeth(C$, 'printinstructions$I', function (i) {
if (i == 0) {
this.textpanel.setColor$java_awt_Color($I$(3).black);
} else {
this.textpanel.setColor$java_awt_Color($I$(16).darkGreen);
}(this.cards.getLayout$()).show$java_awt_Container$S(this.cards, "textcard");
var temp=Clazz.new_($I$(10));
switch (i) {
case 0:
temp.addElement$TE("Choose an associated curve");
temp.addElement$TE("from the list above left.");
break;
case 1:
temp.addElement$TE("The Evolute is the curve drawn in red.");
break;
case 2:
temp.addElement$TE("Click on a point.");
temp.addElement$TE("You can drag the mouse to move the point");
break;
case 3:
temp.addElement$TE("Click on the centre of a circle and");
temp.addElement$TE("drag to a point on the circumference.");
temp.addElement$TE("You can drag the centre dot or readjust the radius.");
break;
case 4:
temp.addElement$TE("Click on a point.");
temp.addElement$TE("You can drag the mouse to move the point.");
break;
case 5:
temp.addElement$TE("Click on a point.");
temp.addElement$TE("You can drag the mouse to move the point.");
break;
case 6:
temp.addElement$TE("Click on a point.");
temp.addElement$TE("You can drag the mouse to move the point.");
break;
case 7:
temp.addElement$TE("Click on the point of a line");
temp.addElement$TE("that goes through the origin.");
temp.addElement$TE("You can drag the mouse to alter the line.");
break;
}
this.textpanel.setText$java_util_Vector(temp);
this.textpanel.setFontSize$I(12);
});

Clazz.newMeth(C$, 'printcontrols$', function () {
(this.cards.getLayout$()).show$java_awt_Container$S(this.cards, "controlcard");
});

Clazz.newMeth(C$, 'fD$D', function (d) {
var dp=3;
var s=String.format$S$OA("%." + dp + "f" , [new Double(d)]);
for (var i=0; i < dp; i++) {
if (s.indexOf$S(".") > -1 && s.endsWith$S("0") ) {
s=s.substring$I$I(0, s.length$() - 1);
}}
if (s.endsWith$S(".")) {
s=s.substring$I$I(0, s.length$() - 1);
}return s;
}, 1);

Clazz.newMeth(C$);
})();
;Clazz.setTVer('3.2.4.07');//Created 2019-08-02 17:21:01 Java2ScriptVisitor version 3.2.4.07 net.sf.j2s.core.jar version 3.2.4.07
