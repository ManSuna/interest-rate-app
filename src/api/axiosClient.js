@RestController
@RequestMapping("/api/rtp")
@RequiredArgsConstructor
@Slf4j
public class RTPDataLoadController {

private final RTPDataLoadService rtpDataLoadService;

@PostMapping("/full-load")
public ResponseEntity<String> runFullLoad(
@RequestParam String from,
@RequestParam String to,
@RequestParam(defaultValue = "true") boolean loadAccounts,
@RequestParam(defaultValue = "true") boolean loadRouting
) {

try {
LocalDateTime fromTime = LocalDateTime.parse(from);
LocalDateTime toTime = LocalDateTime.parse(to);

rtpDataLoadService.runFullLoad(
fromTime,
toTime,
loadAccounts,
loadRouting
);

return ResponseEntity.ok("Full load started successfully");

} catch (Exception e) {
log.error("Error running full load", e);
return ResponseEntity.internalServerError()
.body("Error: " + e.getMessage());
}
}
}
