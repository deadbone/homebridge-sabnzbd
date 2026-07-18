export interface SabnzbdQueueResponse {
  readonly queue: SabnzbdQueue;
}

export interface SabnzbdQueue {
  readonly status?: string;
  readonly speedlimit?: string;
  readonly speedlimit_abs?: string;
  readonly paused?: boolean;
  readonly paused_all?: boolean;
  readonly noofslots?: number | string;
  readonly noofslots_total?: number | string;
  readonly timeleft?: string;
  readonly speed?: string;
  readonly kbpersec?: string | number;
  readonly mb?: string | number;
  readonly mbleft?: string | number;
  readonly size?: string;
  readonly sizeleft?: string;
  readonly slots?: readonly SabnzbdQueueSlot[];
  readonly diskspace1?: string | number;
  readonly diskspace1_norm?: string;
  readonly diskspace2?: string | number;
  readonly diskspace2_norm?: string;
  readonly have_warnings?: string | number | boolean;
  readonly pause_int?: string | number;
  readonly version?: string;
}

export interface SabnzbdQueueSlot {
  readonly status?: string;
  readonly percentage?: string | number;
  readonly nzo_id?: string;
}

export interface SabnzbdHistoryResponse {
  readonly history: SabnzbdHistory;
}

export interface SabnzbdHistory {
  readonly noofslots?: number | string;
  readonly last_history_update?: number;
  readonly slots?: readonly SabnzbdHistorySlot[];
}

export interface SabnzbdHistorySlot {
  readonly status?: string;
  readonly completed?: number;
  readonly time_added?: number;
  readonly name?: string;
  readonly nzo_id?: string;
  readonly fail_message?: string;
}

export interface SabnzbdStatusResponse {
  readonly status: SabnzbdStatus;
}

export interface SabnzbdStatus {
  readonly have_warnings?: string | number | boolean;
  readonly warnings?: readonly unknown[];
  readonly restart_req?: boolean;
  readonly uptime?: string;
  readonly version?: string;
}

export interface SabnzbdCommandResponse {
  readonly status?: boolean;
  readonly error?: string;
}

export interface SabnzbdSnapshot {
  readonly reachable: boolean;
  readonly version: string;
  readonly status: string;
  readonly paused: boolean;
  readonly downloading: boolean;
  readonly queueNotEmpty: boolean;
  readonly hasWarnings: boolean;
  readonly lastDownloadFailed: boolean;
  readonly lastDownloadCompleted: boolean;
  readonly progressPercent: number;
  readonly speedKbps: number;
  readonly speedLabel: string;
  readonly eta: string;
  readonly diskFreeGb: number;
  readonly diskFreeLabel: string;
  readonly queueCount: number;
  readonly recentFailureCount: number;
  readonly updatedAt: Date;
  readonly errorMessage?: string;
}
