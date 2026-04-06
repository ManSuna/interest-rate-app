<mxfile host="app.diagrams.net">
  <diagram name="FWI Design">
    <mxGraphModel dx="1000" dy="600" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="1100" pageHeight="850">
      <root>
        <mxCell id="0"/>
        <mxCell id="1" parent="0"/>

        <!-- Fedwire -->
        <mxCell id="fw" value="Fedwire&#xa;- System Notification&#xa;- Extension Notification (mm:ss)" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#dae8fc;" vertex="1" parent="1">
          <mxGeometry x="50" y="100" width="200" height="80" as="geometry"/>
        </mxCell>

        <!-- FedNow -->
        <mxCell id="fn" value="FedNow&#xa;- System Notification" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#d5e8d4;" vertex="1" parent="1">
          <mxGeometry x="50" y="220" width="200" height="60" as="geometry"/>
        </mxCell>

        <!-- Listener -->
        <mxCell id="listener" value="FWI Message Listener" style="rounded=1;whiteSpace=wrap;html=1;" vertex="1" parent="1">
          <mxGeometry x="300" y="160" width="200" height="60" as="geometry"/>
        </mxCell>

        <!-- Router -->
        <mxCell id="router" value="Message Type Router&#xa;- FedNow System Notification&#xa;- Fedwire System Notification&#xa;- Fedwire Extension Notification" style="rounded=1;whiteSpace=wrap;html=1;" vertex="1" parent="1">
          <mxGeometry x="550" y="150" width="260" height="100" as="geometry"/>
        </mxCell>

        <!-- Resolver -->
        <mxCell id="resolver" value="Cycle / Closing Time Resolver&#xa;&#xa;Default: 7:01 PM ET&#xa;&#xa;If Extension Received:&#xa;Closing Time = 7:01 PM + mm:ss" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#fff2cc;" vertex="1" parent="1">
          <mxGeometry x="850" y="140" width="260" height="120" as="geometry"/>
        </mxCell>

        <!-- Updater -->
        <mxCell id="updater" value="FedBalance Updater&#xa;- Insert or Update&#xa;- cycle_date&#xa;- closing_time" style="rounded=1;whiteSpace=wrap;html=1;" vertex="1" parent="1">
          <mxGeometry x="1150" y="160" width="220" height="80" as="geometry"/>
        </mxCell>

        <!-- DB -->
        <mxCell id="db" value="FED_BALANCE&#xa;- cycle_date&#xa;- closing_time&#xa;- record_type&#xa;- source_system" style="shape=cylinder;whiteSpace=wrap;html=1;fillColor=#f8cecc;" vertex="1" parent="1">
          <mxGeometry x="1420" y="160" width="180" height="80" as="geometry"/>
        </mxCell>

        <!-- Arrows -->
        <mxCell id="e1" style="endArrow=block;" edge="1" parent="1" source="fw" target="listener">
          <mxGeometry relative="1" as="geometry"/>
        </mxCell>

        <mxCell id="e2" style="endArrow=block;" edge="1" parent="1" source="fn" target="listener">
          <mxGeometry relative="1" as="geometry"/>
        </mxCell>

        <mxCell id="e3" style="endArrow=block;" edge="1" parent="1" source="listener" target="router">
          <mxGeometry relative="1" as="geometry"/>
        </mxCell>

        <mxCell id="e4" style="endArrow=block;" edge="1" parent="1" source="router" target="resolver">
          <mxGeometry relative="1" as="geometry"/>
        </mxCell>

        <mxCell id="e5" style="endArrow=block;" edge="1" parent="1" source="resolver" target="updater">
          <mxGeometry relative="1" as="geometry"/>
        </mxCell>

        <mxCell id="e6" style="endArrow=block;" edge="1" parent="1" source="updater" target="db">
          <mxGeometry relative="1" as="geometry"/>
        </mxCell>

      </root>
    </mxGraphModel>
  </diagram>
</mxfile>
