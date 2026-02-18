<mxfile host="app.diagrams.net">
<diagram name="Flow">
<mxGraphModel dx="1200" dy="700" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="1100" pageHeight="850" math="0" shadow="0">
<root>
<mxCell id="0"/>
<mxCell id="1" parent="0"/>

<!-- Containers -->
<mxCell id="c1" value="1) Database → Application → File" style="rounded=1;whiteSpace=wrap;html=1;strokeWidth=2;" vertex="1" parent="1">
<mxGeometry x="40" y="40" width="500" height="260" as="geometry"/>
</mxCell>

<mxCell id="c2" value="2) File → Application → Database" style="rounded=1;whiteSpace=wrap;html=1;strokeWidth=2;" vertex="1" parent="1">
<mxGeometry x="40" y="340" width="500" height="220" as="geometry"/>
</mxCell>

<!-- Flow 1 nodes -->
<mxCell id="db1" value="RTPANDB&#xa;T_TRANSACTION table" style="shape=cylinder3;whiteSpace=wrap;html=1;" vertex="1" parent="1">
<mxGeometry x="70" y="110" width="130" height="80" as="geometry"/>
</mxCell>

<mxCell id="app1" value="Fraud DataLoader&#xa;• Read in chunks&#xa;• Encrypt&#xa;• Create CSV" style="rounded=1;whiteSpace=wrap;html=1;" vertex="1" parent="1">
<mxGeometry x="230" y="100" width="180" height="110" as="geometry"/>
</mxCell>

<mxCell id="file1" value="Encrypted CSV File" style="shape=folder;whiteSpace=wrap;html=1;" vertex="1" parent="1">
<mxGeometry x="430" y="120" width="140" height="70" as="geometry"/>
</mxCell>

<mxCell id="s3" value="S3 Bucket" style="rounded=1;whiteSpace=wrap;html=1;strokeWidth=2;" vertex="1" parent="1">
<mxGeometry x="610" y="120" width="140" height="70" as="geometry"/>
</mxCell>

<!-- Flow 2 nodes -->
<mxCell id="file2" value="CSV File" style="shape=folder;whiteSpace=wrap;html=1;" vertex="1" parent="1">
<mxGeometry x="90" y="420" width="140" height="70" as="geometry"/>
</mxCell>

<mxCell id="app2" value="Account Proxy Application&#xa;• Read CSV&#xa;• Write to Postgres" style="rounded=1;whiteSpace=wrap;html=1;" vertex="1" parent="1">
<mxGeometry x="260" y="410" width="200" height="90" as="geometry"/>
</mxCell>

<mxCell id="pg" value="Postgres Database" style="shape=cylinder3;whiteSpace=wrap;html=1;" vertex="1" parent="1">
<mxGeometry x="490" y="420" width="150" height="80" as="geometry"/>
</mxCell>

<!-- Edges -->
<mxCell id="e1" style="endArrow=block;html=1;" edge="1" parent="1" source="db1" target="app1">
<mxGeometry relative="1" as="geometry"/>
</mxCell>

<mxCell id="e2" style="endArrow=block;html=1;" edge="1" parent="1" source="app1" target="file1">
<mxGeometry relative="1" as="geometry"/>
</mxCell>

<mxCell id="e3" value="SFTP" style="endArrow=block;html=1;" edge="1" parent="1" source="file1" target="s3">
<mxGeometry relative="1" as="geometry"/>
</mxCell>

<mxCell id="e4" style="endArrow=block;html=1;" edge="1" parent="1" source="s3" target="file2">
<mxGeometry relative="1" as="geometry"/>
</mxCell>

<mxCell id="e5" style="endArrow=block;html=1;" edge="1" parent="1" source="file2" target="app2">
<mxGeometry relative="1" as="geometry"/>
</mxCell>

<mxCell id="e6" style="endArrow=block;html=1;" edge="1" parent="1" source="app2" target="pg">
<mxGeometry relative="1" as="geometry"/>
</mxCell>
</root>
</mxGraphModel>
</diagram>
</mxfile>
