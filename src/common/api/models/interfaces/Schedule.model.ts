export interface IScheduleDTO {
  schedule: ISchedule;
}

export interface ISetPrescriberScheduleDTO extends IScheduleDTO {
  spa_prescriber_id: string;
}

export interface ISchedule {
  weekly: IWeekly[];
  specific: ISpecific[];
}

export interface IWeekly {
  id?: number;
  day: string;
  slots: number[];
  isActive: 0 | 1;
}

export interface ISpecific {
  id?: number;
  start_date: string;
  end_date: string;
  slots: number[];
  isAvailable: number;
}

export interface ISlot {
  id: number;
  start_time: string;
  end_time: string;
  shift: string;
  note?: any;
  status?: number;
  created_at?: any;
  updated_at?: any;
}
export interface IDocAptScheduleCardProps {
  btnBgName?: string;
  btnTextColor?: string;
  isEdit?: boolean;
  scheduleData: IScheduleCardSchedule;
}
export interface IScheduleCardSchedule {
  date: string;
  startTime: string;
  patient_name: string;
  patient_id: number;
  drug_name: string;
  meeting_type: string;
  meeting_link: string;
}
