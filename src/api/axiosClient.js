import freemarker.cache.ClassTemplateLoader;
import freemarker.cache.FileTemplateLoader;
import freemarker.cache.TemplateLoader;
import freemarker.template.Configuration;
import freemarker.template.Template;
import freemarker.template.TemplateException;

import java.io.File;
import java.io.IOException;
import java.io.StringWriter;
import java.nio.charset.StandardCharsets;
import java.util.Map;

public class FtlService {

    public String generateXmlMsg(Object model, String basePath, String ftlPath)
            throws IOException, TemplateException {

        Configuration cfg = new Configuration(Configuration.VERSION_2_3_32);
        cfg.setDefaultEncoding(StandardCharsets.UTF_8.name());

        // basePath examples:
        //   "classpath:/ftl"
        //   "/opt/app/templates"   (disk)
        TemplateLoader loader = createLoader(basePath);
        cfg.setTemplateLoader(loader);

        Template template = cfg.getTemplate(ftlPath);

        StringWriter out = new StringWriter();
        // FreeMarker wants a Map or a bean (bean works too). If you already used beans, keep as-is.
        template.process(model, out);

        return out.toString();
    }

    private TemplateLoader createLoader(String basePath) throws IOException {
        if (basePath == null || basePath.isBlank()) {
            // default to classpath /ftl
            return new ClassTemplateLoader(getClass().getClassLoader(), "/ftl");
        }

        if (basePath.startsWith("classpath:")) {
            String root = basePath.substring("classpath:".length()); // e.g. "/ftl"
            if (root.isBlank()) root = "/";
            return new ClassTemplateLoader(getClass().getClassLoader(), root);
        }

        // otherwise treat as disk folder
        return new FileTemplateLoader(new File(basePath));
    }
}
