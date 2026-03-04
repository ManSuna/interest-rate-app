import freemarker.template.Configuration;
import freemarker.template.Template;
import freemarker.template.TemplateException;

import java.io.File;
import java.io.IOException;
import java.io.StringWriter;
import java.io.Writer;

public class FtlService {

    private final Configuration configuration;

    public FtlService() {
        configuration = new Configuration(Configuration.VERSION_2_3_31);
        // Don’t hardcode loader here because you change it per call based on ftlPath
    }

    public String generateXmlMsg(Object ftlPojo, String ftlPath, String ftlFileName)
            throws IOException, TemplateException {

        Writer writer = new StringWriter();

        configuration.clearTemplateCache();

        // ✅ If templates are inside JAR
        if (ftlPath != null && (ftlPath.startsWith("classpath:") || ftlPath.startsWith("/"))) {

            // examples supported:
            // "classpath:/ftl"
            // "/ftl"
            String base = ftlPath.startsWith("classpath:")
                    ? ftlPath.substring("classpath:".length())
                    : ftlPath;

            if (!base.startsWith("/")) {
                base = "/" + base;
            }

            // Load from classpath inside the jar
            configuration.setClassForTemplateLoading(FtlService.class, base);

        } else {
            // ✅ Otherwise treat it as a folder on disk
            configuration.setDirectoryForTemplateLoading(new File(ftlPath));
        }

        Template template = configuration.getTemplate(ftlFileName);
        template.process(ftlPojo, writer);

        return writer.toString();
    }
}
