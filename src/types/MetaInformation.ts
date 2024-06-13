export interface MetaInformation {
  /**
   * Human-readable name of the project (e.g., for display purposes).
   */
  projectIdentification: string;

  /**
   * Creator of the LIF file (e.g., name of company, or name of person).
   */
  creator: string;

  /**
   * The timestamp at which this LIF file was created/updated/modified.
   * Used to distinguish LIF file versions over time.
   * Timestamp format is ISO8601 in UTC (YYYY-MM-DDTHH:mm:ss.ssZ, e.g., "2017-04-15T11:40:03.12Z").
   */
  exportTimestamp: string;

  /**
   * Version of LIF: [Major].[Minor].[Patch] (e.g., 0.11.0).
   * This is the semantic version of the LIF format.
   */
  lifVersion: string;
}
