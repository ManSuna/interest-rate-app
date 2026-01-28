package com.vocalink.ips.cnc.status.dao;

import static java.util.Collections.emptyList;
import static java.util.Collections.singletonList;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

import java.util.*;

import org.joda.time.DateTime;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;

import com.vocalink.ips.cnccommon.support.TimeServices;
// Adjust these imports to your actual packages:
import com.vocalink.ips.cnc.status.model.AuditRecord;
import com.vocalink.ips.cnc.status.model.ConfigUpdate;
import com.vocalink.ips.cnc.status.model.MultipleSiteConfigUpdateResults;
import com.vocalink.ips.cnc.status.model.SiteSuccess;
import com.vocalink.ips.cnc.status.model.SwitchResponse;

@ExtendWith(MockitoExtension.class)
class JdbcSwitchStatusAuditDaoTest {

private static final String SEQ_AUDIT = "SWITCH_STATUS_AUDIT_SEQ";
private static final String SEQ_SITE_SUCCESS = "SWITCH_STATUS_SITE_SUCCESS_SEQ";

private static final String SQL_FIND_CURRENT = "select ...";
private static final String SQL_INSERT_CURRENT = "insert ...";
private static final String SQL_UPDATE_ENDDATE = "update ...";
private static final String SQL_FIND_HISTORY = "select ...";
private static final String SQL_INSERT_SITE_SUCCESS = "insert ...";
private static final String SQL_SELECT_SITE_SUCCESS = "select ...";

@Mock private NamedParameterJdbcTemplate namedParameterJdbcTemplate;
@Mock private SequenceHelper sequenceHelper;
@Mock private ConfigUpdateDao configUpdateDao;
@Mock private TimeServices timeServices;

@InjectMocks private JdbcSwitchStatusAuditDao dao;

@BeforeEach
void setUp() {
// These match your Lombok @Setter(onMethod_=@Required) fields in the screenshots
dao.setSequenceName(SEQ_AUDIT);
dao.setSwitchStatusSiteSuccessSequenceName(SEQ_SITE_SUCCESS);

dao.setFindCurrentSql(SQL_FIND_CURRENT);
dao.setInsertCurrentSql(SQL_INSERT_CURRENT);
dao.setUpdateEndDateSql(SQL_UPDATE_ENDDATE);
dao.setFindHistorySql(SQL_FIND_HISTORY);
dao.setInsertSiteSuccess(SQL_INSERT_SITE_SUCCESS);
dao.setSelectSiteSuccess(SQL_SELECT_SITE_SUCCESS);

dao.setConfigUpdateDao(configUpdateDao);
dao.setTimeServices(timeServices);
dao.setSequenceHelper(sequenceHelper);
dao.setDefaultIntervalDays(20);
}

// -------------------------
// findCurrent()
// -------------------------

@Test
void findCurrent_returnsAfter_whenRowExists() {
AuditRecord<String> record = mock(AuditRecord.class);
when(record.getAfter()).thenReturn("AFTER_STATUS");

when(namedParameterJdbcTemplate.query(eq(SQL_FIND_CURRENT), any(RowMapper.class)))
.thenReturn(singletonList(record));

String result = dao.findCurrent();

assertEquals("AFTER_STATUS", result);
}

@Test
void findCurrent_returnsNull_whenNoRows() {
when(namedParameterJdbcTemplate.query(eq(SQL_FIND_CURRENT), any(RowMapper.class)))
.thenReturn(emptyList());

assertNull(dao.findCurrent());
}

// -------------------------
// updateCurrent(...)
// -------------------------

@Test
void updateCurrent_whenCurrentExists_updatesEndDate_andInsertsNewAudit_andSiteSuccess() {
// given
AuditRecord<String> existing = mock(AuditRecord.class);
when(existing.getId()).thenReturn(55L);

when(namedParameterJdbcTemplate.query(eq(SQL_FIND_CURRENT), any(RowMapper.class)))
.thenReturn(singletonList(existing));

DateTime nowUtc = new DateTime(2020, 1, 1, 0, 0);
when(timeServices.dateTime()).thenReturn(nowUtc);

when(sequenceHelper.getNextSequenceValue(eq(namedParameterJdbcTemplate), eq(SEQ_AUDIT)))
.thenReturn(101L);
when(sequenceHelper.getNextSequenceValue(eq(namedParameterJdbcTemplate), eq(SEQ_SITE_SUCCESS)))
.thenReturn(202L);

ConfigUpdate configUpdate = new ConfigUpdate();
configUpdate.setId("101");

SwitchResponse okResponse = new SwitchResponse() {
@Override public boolean isSwitchCalledSuccessfully() { return true; }
};

MultipleSiteConfigUpdateResults multi = new MultipleSiteConfigUpdateResults();
multi.addResult("siteA", okResponse);

// when
dao.updateCurrent("AFTER", "BEFORE", configUpdate, multi);

// then
// end-date update should happen because currentValues is NOT empty
verify(namedParameterJdbcTemplate).update(eq(SQL_UPDATE_ENDDATE), argThat(params ->
Objects.equals(params.getValue("endDate"), DateSupport.toDatabaseWithoutTimezone(nowUtc)) &&
Objects.equals(params.getValue("switchStatusAuditId"), 55L)
));

// audit insert
verify(namedParameterJdbcTemplate).update(eq(SQL_INSERT_CURRENT), argThat(params ->
Objects.equals(params.getValue("switchStatusAuditId"), 101L) &&
Objects.equals(params.getValue("configUpdateId"), Long.valueOf(configUpdate.getId())) &&
Objects.equals(params.getValue("statusAfter"), "AFTER") &&
Objects.equals(params.getValue("statusBefore"), "BEFORE") &&
Objects.equals(params.getValue("startDate"), DateSupport.toDatabaseWithoutTimezone(nowUtc))
));

// site success insert
verify(namedParameterJdbcTemplate).update(eq(SQL_INSERT_SITE_SUCCESS), argThat(params ->
Objects.equals(params.getValue("switchStatusSiteSuccessId"), 202L) &&
Objects.equals(params.getValue("switchStatusAuditId"), 101L) &&
Objects.equals(params.getValue("site"), "siteA")
));
}

@Test
void updateCurrent_whenNoCurrent_doesNotUpdateEndDate_butInsertsNewAudit() {
// given
when(namedParameterJdbcTemplate.query(eq(SQL_FIND_CURRENT), any(RowMapper.class)))
.thenReturn(emptyList());

DateTime nowUtc = new DateTime(2020, 1, 1, 0, 0);
when(timeServices.dateTime()).thenReturn(nowUtc);

when(sequenceHelper.getNextSequenceValue(eq(namedParameterJdbcTemplate), eq(SEQ_AUDIT)))
.thenReturn(999L);

ConfigUpdate configUpdate = new ConfigUpdate();
configUpdate.setId("101");

// when
dao.updateCurrent("AFTER", "BEFORE", configUpdate, null);

// then
verify(namedParameterJdbcTemplate, never()).update(eq(SQL_UPDATE_ENDDATE), any(MapSqlParameterSource.class));

verify(namedParameterJdbcTemplate).update(eq(SQL_INSERT_CURRENT), any(MapSqlParameterSource.class));
}

@Test
void updateCurrent_ignoresUnsuccessfulSiteResults() {
// given
when(namedParameterJdbcTemplate.query(eq(SQL_FIND_CURRENT), any(RowMapper.class)))
.thenReturn(emptyList());

DateTime nowUtc = new DateTime(2020, 1, 1, 0, 0);
when(timeServices.dateTime()).thenReturn(nowUtc);

when(sequenceHelper.getNextSequenceValue(eq(namedParameterJdbcTemplate), eq(SEQ_AUDIT)))
.thenReturn(101L);

ConfigUpdate configUpdate = new ConfigUpdate();
configUpdate.setId("101");

SwitchResponse badResponse = new SwitchResponse() {
@Override public boolean isSwitchCalledSuccessfully() { return false; }
};

MultipleSiteConfigUpdateResults multi = new MultipleSiteConfigUpdateResults();
multi.addResult("siteBad", badResponse);

// when
dao.updateCurrent("AFTER", "BEFORE", configUpdate, multi);

// then: no site-success sequence nor insert should happen
verify(sequenceHelper, never()).getNextSequenceValue(eq(namedParameterJdbcTemplate), eq(SEQ_SITE_SUCCESS));
verify(namedParameterJdbcTemplate, never()).update(eq(SQL_INSERT_SITE_SUCCESS), any(MapSqlParameterSource.class));
}

// -------------------------
// findHistory(DateTime)
// -------------------------

@Test
void findHistory_removesRecordsWithNullConfigUpdate_andLoadsSiteSuccesses() {
// given
DateTime sinceDate = new DateTime(2020, 1, 10, 0, 0);

// config updates map used by rowmapper
ConfigUpdate cu = new ConfigUpdate();
cu.setId("101");
when(configUpdateDao.findConfigUpdatesSinceDate(any(DateTime.class))).thenReturn(singletonList(cu));

// history records
AuditRecord<String> keep = mock(AuditRecord.class);
when(keep.getId()).thenReturn(10L);
when(keep.getConfigUpdate()).thenReturn(cu);

AuditRecord<String> drop = mock(AuditRecord.class);
when(drop.getConfigUpdate()).thenReturn(null);

when(namedParameterJdbcTemplate.query(eq(SQL_FIND_HISTORY), any(MapSqlParameterSource.class), any(RowMapper.class)))
.thenReturn(Arrays.asList(drop, keep));

List<SiteSuccess> siteSuccesses = singletonList(new SiteSuccess(1L, "siteA"));
when(namedParameterJdbcTemplate.query(eq(SQL_SELECT_SITE_SUCCESS), any(MapSqlParameterSource.class), any(RowMapper.class)))
.thenReturn(siteSuccesses);

// when
List<AuditRecord<String>> result = dao.findHistory(sinceDate);

// then: null-configUpdate record removed
assertEquals(1, result.size());
assertSame(keep, result.get(0));

// and children loaded + set
verify(namedParameterJdbcTemplate).query(eq(SQL_SELECT_SITE_SUCCESS), argThat(params ->
Objects.equals(params.getValue("switchStatusAuditId"), 10L)
), any(RowMapper.class));

verify(keep).setSiteSuccesses(siteSuccesses);
}
}
