package org.tch.fed.config;

import com.ibm.mq.jms.MQConnectionFactory;
import com.ibm.msg.client.wmq.WMQConstants;
import jakarta.jms.ConnectionFactory;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.tch.fed.properties.MQProperties;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Configuration
@EnableConfigurationProperties(MQProperties.class)
public class IbmMqCommonConfig {

    private final MQProperties mqProperties;

    public IbmMqCommonConfig(MQProperties mqProperties) {
        this.mqProperties = mqProperties;
    }

    @Bean(name = "fedwireConnectionFactory")
    public ConnectionFactory fedwireConnectionFactory() throws Exception {
        return buildMqConnectionFactory(mqProperties.getCommon(), mqProperties.getFedwire());
    }

    @Bean(name = "fednowConnectionFactory")
    public ConnectionFactory fednowConnectionFactory() throws Exception {
        return buildMqConnectionFactory(mqProperties.getCommon(), mqProperties.getFednow());
    }

    private ConnectionFactory buildMqConnectionFactory(MQProperties.Common common,
                                                      MQProperties.Endpoint endpoint) throws Exception {

        // Resolve relative path like "config/fedwire-interface.jks" into absolute disk path
        Path keyStorePath = resolveDiskPath(common.getKeyStorePath());
        Path trustStorePath = resolveDiskPath(common.getTrustStorePath());

        // Basic validation so you don’t chase Tomcat temp-path weirdness
        if (!Files.exists(keyStorePath)) {
            throw new IllegalStateException("Keystore not found on disk: " + keyStorePath);
        }
        if (!Files.exists(trustStorePath)) {
            throw new IllegalStateException("Truststore not found on disk: " + trustStorePath);
        }

        // Tell JVM SSL where the stores are. IBM MQ uses JVM SSL automatically.
        System.setProperty("javax.net.ssl.keyStore", keyStorePath.toString());
        System.setProperty("javax.net.ssl.keyStorePassword", common.getKeyStorePassword());
        System.setProperty("javax.net.ssl.keyStoreType", common.getKeyStoreType());

        System.setProperty("javax.net.ssl.trustStore", trustStorePath.toString());
        System.setProperty("javax.net.ssl.trustStorePassword", common.getTrustStorePassword());
        System.setProperty("javax.net.ssl.trustStoreType", common.getTrustStoreType());

        MQConnectionFactory cf = new MQConnectionFactory();
        cf.setTransportType(WMQConstants.WMQ_CM_CLIENT);

        // MQ endpoint config
        cf.setQueueManager(endpoint.getQueueManager());
        cf.setConnectionNameList(endpoint.getConnName());
        cf.setChannel(endpoint.getChannel());

        // TLS settings
        if (endpoint.getCipherSuite() != null && !endpoint.getCipherSuite().isBlank()) {
            cf.setStringProperty(WMQConstants.WMQ_SSL_CIPHER_SUITE, endpoint.getCipherSuite());
        }
        if (endpoint.getPeerName() != null && !endpoint.getPeerName().isBlank()) {
            cf.setStringProperty(WMQConstants.WMQ_SSL_PEER_NAME, endpoint.getPeerName());
        }

        return cf;
    }

    /**
     * Accepts:
     *  - absolute path: C:\...\config\fedwire-interface.jks
     *  - relative path: config/fedwire-interface.jks (resolved from current working dir)
     */
    private static Path resolveDiskPath(String rawPath) {
        if (rawPath == null || rawPath.isBlank()) {
            throw new IllegalArgumentException("Keystore/truststore path is blank");
        }

        Path p = Paths.get(rawPath);
        if (!p.isAbsolute()) {
            p = Paths.get(System.getProperty("user.dir")).resolve(p);
        }
        return p.normalize().toAbsolutePath();
    }
}
