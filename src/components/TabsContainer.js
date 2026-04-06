<mxfile host="app.diagrams.net" modified="2026-04-06T00:00:00.000Z" agent="OpenAI" version="24.7.17">
  <diagram id="fwi-cycle-design-v2" name="FWI Cycle Closing Time Design v2">
    <mxGraphModel dx="1800" dy="1200" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="1800" pageHeight="1200" math="0" shadow="0">
      <root>
        <mxCell id="0"/>
        <mxCell id="1" parent="0"/>

        <mxCell id="title" value="FWI Design - FedNow / Fedwire Notifications, Audit Persistence, and FED_BALANCE for APP2 Interest Calculation" style="text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;fontSize=20;fontStyle=1" vertex="1" parent="1">
          <mxGeometry x="210" y="20" width="1380" height="30" as="geometry"/>
        </mxCell>

        <!-- inbound messages -->
        <mxCell id="fnSys" value="FedNow&#xa;System Notification&#xa;(~7:00 PM ET)" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#d5e8d4;strokeColor=#82b366;fontSize=14" vertex="1" parent="1">
          <mxGeometry x="40" y="100" width="250" height="85" as="geometry"/>
        </mxCell>
        <mxCell id="fnExt" value="FedNow&#xa;Extension Notification&#xa;(arrives when Fedwire extension arrives)" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#d5e8d4;strokeColor=#82b366;fontSize=14" vertex="1" parent="1">
          <mxGeometry x="40" y="210" width="250" height="95" as="geometry"/>
        </mxCell>
        <mxCell id="fwSys" value="Fedwire&#xa;System Notification&#xa;(~7:00 PM ET)&#xa;Not used for FED_BALANCE" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#dae8fc;strokeColor=#6c8ebf;fontSize=14" vertex="1" parent="1">
          <mxGeometry x="40" y="335" width="250" height="100" as="geometry"/>
        </mxCell>
        <mxCell id="fwExt" value="Fedwire&#xa;Extension Notification&#xa;Event Description = MM:SS" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#dae8fc;strokeColor=#6c8ebf;fontSize=14" vertex="1" parent="1">
          <mxGeometry x="40" y="470" width="250" height="95" as="geometry"/>
        </mxCell>

        <!-- listener and audit -->
        <mxCell id="listener" value="FWI Inbound Listener / Parser" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#f5f5f5;strokeColor=#666666;fontSize=14" vertex="1" parent="1">
          <mxGeometry x="390" y="290" width="240" height="90" as="geometry"/>
        </mxCell>
        <mxCell id="audit" value="RECEIVED_MESSAGE&#xa;&#xa;Audit persistence for all inbound notifications:&#xa;- FedNow System Notification&#xa;- FedNow Extension Notification&#xa;- Fedwire System Notification&#xa;- Fedwire Extension Notification" style="shape=cylinder;whiteSpace=wrap;html=1;boundedLbl=1;fillColor=#f8cecc;strokeColor=#b85450;fontSize=14" vertex="1" parent="1">
          <mxGeometry x="360" y="600" width="300" height="210" as="geometry"/>
        </mxCell>

        <!-- routing -->
        <mxCell id="router" value="Message Type Routing" style="rhombus;whiteSpace=wrap;html=1;fillColor=#fff2cc;strokeColor=#d6b656;fontSize=14" vertex="1" parent="1">
          <mxGeometry x="740" y="280" width="190" height="110" as="geometry"/>
        </mxCell>

        <mxCell id="fednowRule" value="FedNow System Notification path&#xa;&#xa;Use this message to INSERT FED_BALANCE with:&#xa;- cycle_date&#xa;- default closing_time = 7:01 PM ET&#xa;- closing_balance" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#e1d5e7;strokeColor=#9673a6;fontSize=14" vertex="1" parent="1">
          <mxGeometry x="1020" y="90" width="340" height="145" as="geometry"/>
        </mxCell>

        <mxCell id="ignoreMsgs" value="Fedwire System Notification path&#xa;FedNow Extension Notification path&#xa;&#xa;Do NOT use these to insert/update FED_BALANCE" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#f8cecc;strokeColor=#b85450;fontSize=14" vertex="1" parent="1">
          <mxGeometry x="1020" y="270" width="340" height="110" as="geometry"/>
        </mxCell>

        <mxCell id="extRule" value="Fedwire Extension path&#xa;&#xa;Read Event Description (MM:SS)&#xa;Extended closing_time = 7:01 PM ET + MM:SS&#xa;&#xa;Update only closing_time in FED_BALANCE" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#ffe6cc;strokeColor=#d79b00;fontSize=14" vertex="1" parent="1">
          <mxGeometry x="1020" y="430" width="340" height="140" as="geometry"/>
        </mxCell>

        <!-- core tables -->
        <mxCell id="fedbal" value="FED_BALANCE&#xa;&#xa;Inserted from FedNow System Notification:&#xa;- cycle_date&#xa;- closing_time = 7:01 PM ET&#xa;- closing_balance&#xa;&#xa;Updated only from Fedwire Extension:&#xa;- closing_time = 7:01 PM ET + MM:SS" style="shape=cylinder;whiteSpace=wrap;html=1;boundedLbl=1;fillColor=#d5e8d4;strokeColor=#82b366;fontSize=14" vertex="1" parent="1">
          <mxGeometry x="1450" y="160" width="300" height="220" as="geometry"/>
        </mxCell>

        <mxCell id="app2" value="APP2&#xa;Interest Calculation&#xa;&#xa;Joins to FED_BALANCE&#xa;to get cycle_date / closing_time / closing_balance" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#dae8fc;strokeColor=#6c8ebf;fontSize=14" vertex="1" parent="1">
          <mxGeometry x="1450" y="500" width="300" height="120" as="geometry"/>
        </mxCell>

        <mxCell id="example" value="Example&#xa;&#xa;At ~7:00 PM ET FWI receives 4 messages and saves all 4 to RECEIVED_MESSAGE for audit.&#xa;&#xa;FED_BALANCE insert uses only FedNow System Notification:&#xa;- cycle_date = 2026-04-06&#xa;- closing_time = 7:01 PM ET&#xa;- closing_balance = &lt;from FedNow&gt;&#xa;&#xa;If Fedwire Extension Event Description = 15:00, update FED_BALANCE closing_time to 7:16 PM ET." style="rounded=1;whiteSpace=wrap;html=1;fillColor=#fff2cc;strokeColor=#d6b656;fontSize=13" vertex="1" parent="1">
          <mxGeometry x="980" y="670" width="510" height="190" as="geometry"/>
        </mxCell>

        <mxCell id="note" value="Design intent&#xa;1. FedNow System Notification and Fedwire System Notification arrive at about the same time around 7:00 PM ET.&#xa;2. FedNow Extension Notification also arrives when Fedwire Extension arrives.&#xa;3. All 4 messages are stored in RECEIVED_MESSAGE for audit.&#xa;4. Only FedNow System Notification inserts FED_BALANCE.&#xa;5. Fedwire System Notification is ignored for FED_BALANCE.&#xa;6. FedNow Extension Notification is also ignored for FED_BALANCE.&#xa;7. Only Fedwire Extension Notification is used to update FED_BALANCE closing_time using Event Description MM:SS.&#xa;8. FED_BALANCE exists so APP2 can use it in join interest calculation." style="rounded=1;whiteSpace=wrap;html=1;fillColor=#f5f5f5;strokeColor=#666666;fontSize=13" vertex="1" parent="1">
          <mxGeometry x="40" y="860" width="1710" height="170" as="geometry"/>
        </mxCell>

        <!-- inbound edges -->
        <mxCell id="e1" edge="1" source="fnSys" target="listener" style="endArrow=block;endFill=1;strokeWidth=2;" parent="1"><mxGeometry relative="1" as="geometry"/></mxCell>
        <mxCell id="e2" edge="1" source="fnExt" target="listener" style="endArrow=block;endFill=1;strokeWidth=2;" parent="1"><mxGeometry relative="1" as="geometry"/></mxCell>
        <mxCell id="e3" edge="1" source="fwSys" target="listener" style="endArrow=block;endFill=1;strokeWidth=2;" parent="1"><mxGeometry relative="1" as="geometry"/></mxCell>
        <mxCell id="e4" edge="1" source="fwExt" target="listener" style="endArrow=block;endFill=1;strokeWidth=2;" parent="1"><mxGeometry relative="1" as="geometry"/></mxCell>

        <!-- audit edges -->
        <mxCell id="e5" value="save all inbound messages" edge="1" source="listener" target="audit" style="endArrow=block;endFill=1;strokeWidth=2;strokeColor=#b85450;" parent="1">
          <mxGeometry relative="1" as="geometry">
            <Array as="points"><mxPoint x="510" y="500"/></Array>
          </mxGeometry>
        </mxCell>

        <!-- routing edges -->
        <mxCell id="e6" edge="1" source="listener" target="router" style="endArrow=block;endFill=1;strokeWidth=2;" parent="1"><mxGeometry relative="1" as="geometry"/></mxCell>
        <mxCell id="e7" value="FedNow System Notification" edge="1" source="router" target="fednowRule" style="endArrow=block;endFill=1;strokeWidth=2;strokeColor=#9673a6;" parent="1"><mxGeometry relative="1" as="geometry"/></mxCell>
        <mxCell id="e8" value="Fedwire System Notification + FedNow Extension" edge="1" source="router" target="ignoreMsgs" style="endArrow=block;endFill=1;strokeWidth=2;strokeColor=#b85450;" parent="1"><mxGeometry relative="1" as="geometry"/></mxCell>
        <mxCell id="e9" value="Fedwire Extension Notification" edge="1" source="router" target="extRule" style="endArrow=block;endFill=1;strokeWidth=2;strokeColor=#d79b00;" parent="1"><mxGeometry relative="1" as="geometry"/></mxCell>

        <!-- db edges -->
        <mxCell id="e10" value="INSERT" edge="1" source="fednowRule" target="fedbal" style="endArrow=block;endFill=1;strokeWidth=2;strokeColor=#9673a6;" parent="1"><mxGeometry relative="1" as="geometry"/></mxCell>
        <mxCell id="e11" value="No FED_BALANCE action" edge="1" source="ignoreMsgs" target="fedbal" style="endArrow=block;dashed=1;endFill=1;strokeWidth=2;strokeColor=#b85450;" parent="1">
          <mxGeometry relative="1" as="geometry"><Array as="points"><mxPoint x="1410" y="325"/></Array></mxGeometry>
        </mxCell>
        <mxCell id="e12" value="UPDATE closing_time only" edge="1" source="extRule" target="fedbal" style="endArrow=block;endFill=1;strokeWidth=2;strokeColor=#d79b00;" parent="1">
          <mxGeometry relative="1" as="geometry"><Array as="points"><mxPoint x="1410" y="500"/></Array></mxGeometry>
        </mxCell>
        <mxCell id="e13" value="Join interest calculation" edge="1" source="fedbal" target="app2" style="endArrow=block;endFill=1;strokeWidth=2;strokeColor=#6c8ebf;" parent="1">
          <mxGeometry relative="1" as="geometry"><Array as="points"><mxPoint x="1600" y="430"/></Array></mxGeometry>
        </mxCell>

      </root>
    </mxGraphModel>
  </diagram>
</mxfile>
