package org.tch.fed.services;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import java.io.InputStream;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.tch.fed.properties.XmlProperties;
import org.tch.fed.util.SpringResourceReader;

@Slf4j
@Component
@RequiredArgsConstructor
public class FWMessageProcessor {

  private final XmlProperties xmlProperties;
  private final SpringResourceReader resourceReader;
  private final ObjectMapper objectMapper = new ObjectMapper();

  /**
   * Cache template maps by system key (fedwire/fednow).
   */
  private final Map<String, TemplateMap> templateMapsBySystem = new ConcurrentHashMap<>();

  @PostConstruct
  public void init() {
    // Preload both if present (optional but nice)
    xmlProperties.getFtl().getMessageTypeItems().forEach((system, location) -> {
      try {
        templateMapsBySystem.put(system, loadTemplateMap(location));
        log.info("Loaded template map for system={} from {}", system, location);
      } catch (Exception e) {
        log.error("Failed to load template map for system={} from {}", system, location, e);
      }
    });
  }

  private TemplateMap loadTemplateMap(String location) throws Exception {
    try (InputStream in = resourceReader.open(location)) {
      return objectMapper.readValue(in, TemplateMap.class);
    }
  }

  /**
   * Example call: processMessage("fedwire", messageType, baseVo)
   */
  public String processMessage(String system, String messageType, BaseVo baseVo) throws TransformerException {
    TemplateMap templateMap = templateMapsBySystem.computeIfAbsent(system, sys -> {
      String loc = xmlProperties.getFtl().getMessageTypeItems().get(sys);
      if (loc == null) {
        throw new IllegalArgumentException("No template-map configured for system=" + sys);
      }
      try {
        return loadTemplateMap(loc);
      } catch (Exception e) {
        throw new RuntimeException("Failed to load template map for system=" + sys + " from " + loc, e);
      }
    });

    TemplateDefinition def = templateMap.getChipsMessageMap().get(messageType);
    if (def == null) {
      throw new TransformerException("Unknown message type " + messageType + " for system " + system);
    }

    // Your existing logic — the important part is: def.getFtl() can now be classpath:
    FWIMessageTemplate template = getMessageTemplate(def);
    template.setBaseVo(baseVo);
    return template.generateXml(messageType);
  }

  private FWIMessageTemplate getMessageTemplate(TemplateDefinition def) {
    // your existing reflection/lookup
    // IMPORTANT: make sure template reads def.getFtl() via ResourceLoader, not Files/Path.
    return new FWIMessageTemplate(def, resourceReader);
  }
}





package org.tch.fed.services;

import java.io.InputStream;
import lombok.RequiredArgsConstructor;
import org.tch.fed.util.SpringResourceReader;

@RequiredArgsConstructor
public class FWIMessageTemplate {

  private final TemplateDefinition def;
  private final SpringResourceReader resourceReader;

  private BaseVo baseVo;

  public void setBaseVo(BaseVo baseVo) {
    this.baseVo = baseVo;
  }

  public String generateXml(String messageType) {
    String ftlLocation = def.getFtl(); // e.g. classpath:/ftl/fedwire/abcd.ftl
    try (InputStream in = resourceReader.open(ftlLocation)) {
      // OPTION A: read template text and process yourself
      // OPTION B (recommended): use FreeMarker with StringTemplateLoader or custom loader
      String templateText = new String(in.readAllBytes(), java.nio.charset.StandardCharsets.UTF_8);

      // TODO: apply your existing merge logic (freemarker / placeholders / etc.)
      return applyTemplate(templateText, baseVo);

    } catch (Exception e) {
      throw new RuntimeException("Failed to read FTL: " + ftlLocation, e);
    }
  }

  private String applyTemplate(String templateText, BaseVo model) {
    // hook in your existing templating engine
    return templateText; // placeholder
  }
}



package org.tch.fed.util;

import java.io.IOException;
import java.io.InputStream;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class SpringResourceReader {

  private final ResourceLoader resourceLoader;

  public InputStream open(String location) throws IOException {
    Resource resource = resourceLoader.getResource(location);
    if (!resource.exists()) {
      throw new IOException("Resource not found: " + location);
    }
    return resource.getInputStream();
  }
}



package org.tch.fed.properties;

import java.util.HashMap;
import java.util.Map;
import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;

@Data
@ConfigurationProperties(prefix = "xml")
public class XmlProperties {

  private Ftl ftl = new Ftl();

  @Data
  public static class Ftl {
    /**
     * Example:
     *  fedwire -> classpath:/ftl/fedwire/template-map.json
     *  fednow  -> classpath:/ftl/fednow/template-map.json
     */
    private Map<String, String> messageTypeItems = new HashMap<>();
  }
}











