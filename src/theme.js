<project>
  <parent>…</parent>
  <modelVersion>4.0.0</modelVersion>
  <artifactId>ui</artifactId>
  <packaging>pom</packaging>

  <build>
    <plugins>
      <plugin>
        <groupId>com.github.eirslett</groupId>
        <artifactId>frontend-maven-plugin</artifactId>
        <version>1.14.1</version>
        <executions>
          <execution>
            <id>install-node-and-npm</id>
            <goals><goal>install-node-and-npm</goal></goals>
            <phase>generate-resources</phase>
            <configuration>
              <nodeVersion>v18.17.0</nodeVersion>
              <npmVersion>9.8.1</npmVersion>
            </configuration>
          </execution>
          <execution>
            <id>npm install</id>
            <goals><goal>npm</goal></goals>
            <phase>generate-resources</phase>
            <configuration>
              <arguments>install</arguments>
            </configuration>
          </execution>
          <execution>
            <id>npm build</id>
            <goals><goal>npm</goal></goals>
            <phase>generate-resources</phase>
            <configuration>
              <arguments>run build</arguments>
            </configuration>
          </execution>
        </executions>
      </plugin>
    </plugins>
  </build>
</project>
