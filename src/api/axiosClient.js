import com.ibm.mq.jakarta.jms.MQConnectionFactory;
import com.ibm.msg.client.jakarta.wmq.WMQConstants;

import javax.net.ssl.KeyManager;
import javax.net.ssl.KeyManagerFactory;
import javax.net.ssl.SSLContext;
import javax.net.ssl.SSLSocketFactory;
import javax.net.ssl.TrustManagerFactory;
import javax.net.ssl.X509ExtendedKeyManager;
import java.net.Socket;
import java.nio.file.Files;
import java.nio.file.Path;
import java.security.KeyStore;
import java.security.Principal;
import java.security.PrivateKey;
import java.security.cert.X509Certificate;

private ConnectionFactory buildMqConnectionFactory(MQProperties.Common common,
                                                   MQProperties.Endpoint endpoint) throws Exception {

    Path keyStorePath = resolveDiskPath(common.getKeyStorePath());
    Path trustStorePath = resolveDiskPath(common.getTrustStorePath());

    System.setProperty("javax.net.ssl.keyStore", keyStorePath.toString());
    System.setProperty("javax.net.ssl.keyStorePassword", common.getKeyStorePassword());
    System.setProperty("javax.net.ssl.keyStoreType", common.getKeyStoreType());

    System.setProperty("javax.net.ssl.trustStore", trustStorePath.toString());
    System.setProperty("javax.net.ssl.trustStorePassword", common.getTrustStorePassword());
    System.setProperty("javax.net.ssl.trustStoreType", common.getTrustStoreType());

    MQConnectionFactory cf = new MQConnectionFactory();
    cf.setTransportType(WMQConstants.WMQ_CM_CLIENT);
    cf.setQueueManager(endpoint.getQueueManager());
    cf.setConnectionNameList(endpoint.getConnectionNameList());
    cf.setChannel(endpoint.getChannel());

    if (endpoint.getCipherSuite() != null && !endpoint.getCipherSuite().isBlank()) {
        cf.setStringProperty(WMQConstants.WMQ_SSL_CIPHER_SUITE, endpoint.getCipherSuite());
    }

    if (endpoint.getPeerName() != null && !endpoint.getPeerName().isBlank()) {
        cf.setStringProperty(WMQConstants.WMQ_SSL_PEER_NAME, endpoint.getPeerName());
    }

    // force specific alias from the SAME JKS
    SSLSocketFactory sslSocketFactory = buildAliasForcingSocketFactory(
            keyStorePath,
            common.getKeyStorePassword(),
            common.getKeyStoreType(),
            trustStorePath,
            common.getTrustStorePassword(),
            common.getTrustStoreType(),
            common.getClientAlias()
    );

    cf.setObjectProperty(WMQConstants.WMQ_SSL_SOCKET_FACTORY, sslSocketFactory);

    return cf;
}



private SSLSocketFactory buildAliasForcingSocketFactory(Path keyStorePath,
                                                        String keyStorePassword,
                                                        String keyStoreType,
                                                        Path trustStorePath,
                                                        String trustStorePassword,
                                                        String trustStoreType,
                                                        String clientAlias) throws Exception {

    KeyStore keyStore = KeyStore.getInstance(keyStoreType);
    try (var in = Files.newInputStream(keyStorePath)) {
        keyStore.load(in, keyStorePassword.toCharArray());
    }

    KeyStore trustStore = KeyStore.getInstance(trustStoreType);
    try (var in = Files.newInputStream(trustStorePath)) {
        trustStore.load(in, trustStorePassword.toCharArray());
    }

    KeyManagerFactory kmf = KeyManagerFactory.getInstance(KeyManagerFactory.getDefaultAlgorithm());
    kmf.init(keyStore, keyStorePassword.toCharArray());

    TrustManagerFactory tmf = TrustManagerFactory.getInstance(TrustManagerFactory.getDefaultAlgorithm());
    tmf.init(trustStore);

    KeyManager[] keyManagers = kmf.getKeyManagers();
    for (int i = 0; i < keyManagers.length; i++) {
        if (keyManagers[i] instanceof X509ExtendedKeyManager x509) {
            keyManagers[i] = new AliasForcingKeyManager(x509, clientAlias);
        }
    }

    SSLContext sslContext = SSLContext.getInstance("TLS");
    sslContext.init(keyManagers, tmf.getTrustManagers(), null);

    return sslContext.getSocketFactory();
}


import javax.net.ssl.SSLEngine;
import javax.net.ssl.X509ExtendedKeyManager;
import java.net.Socket;
import java.security.Principal;
import java.security.PrivateKey;
import java.security.cert.X509Certificate;

public class AliasForcingKeyManager extends X509ExtendedKeyManager {

    private final X509ExtendedKeyManager delegate;
    private final String clientAlias;

    public AliasForcingKeyManager(X509ExtendedKeyManager delegate, String clientAlias) {
        this.delegate = delegate;
        this.clientAlias = clientAlias;
    }

    @Override
    public String chooseEngineClientAlias(String[] keyType, Principal[] issuers, SSLEngine engine) {
        return clientAlias;
    }

    @Override
    public String chooseClientAlias(String[] keyType, Principal[] issuers, Socket socket) {
        return clientAlias;
    }

    @Override
    public String[] getClientAliases(String keyType, Principal[] issuers) {
        return delegate.getClientAliases(keyType, issuers);
    }

    @Override
    public String chooseServerAlias(String keyType, Principal[] issuers, Socket socket) {
        return delegate.chooseServerAlias(keyType, issuers, socket);
    }

    @Override
    public String[] getServerAliases(String keyType, Principal[] issuers) {
        return delegate.getServerAliases(keyType, issuers);
    }

    @Override
    public X509Certificate[] getCertificateChain(String alias) {
        return delegate.getCertificateChain(alias);
    }

    @Override
    public PrivateKey getPrivateKey(String alias) {
        return delegate.getPrivateKey(alias);
    }
}
