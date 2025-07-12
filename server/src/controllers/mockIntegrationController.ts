// src/controllers/mockIntegrationController.ts
import { Request, Response } from 'express';
import { createAuditLog } from './auditController'; // For logging access

// @desc    Mock EHR Patient Data Sync
// @route   POST /api/mock-integrations/ehr/sync-patient
// @access  Protected (admin)
export const mockEHRPatientSync = async (req: Request, res: Response) => {
  const { patientId, data } = req.body;

  try {
    // Simulate complex EHR data processing
    console.log(`Simulating EHR patient sync for patient ID: ${patientId}`);
    console.log('Received data:', JSON.stringify(data, null, 2));

    // In a real scenario, this would involve:
    // 1. Validating incoming data against EHR schema
    // 2. Transforming data to EHR-compatible format
    // 3. Making an actual API call to the EHR system
    // 4. Handling EHR system's response and errors

    // Simulate success
    const mockResponse = {
      status: 'success',
      message: `Patient data for ${patientId} synchronized with mock EHR.`,
      ehrRecordId: `EHR-${Date.now()}`,
    };

    if (req.user) {
      await createAuditLog(
        req.user._id.toString(),
        req.user.username,
        'integration_sync', // New audit type for integrations
        `Simulated EHR patient data sync for patient ID: ${patientId}`,
        undefined, // No specific resource ID for this mock
        'Integration',
        req
      );
    }

    res.status(200).json(mockResponse);
  } catch (error: any) {
    console.error('Error in mock EHR patient sync:', error);
    res.status(500).json({ message: 'Mock EHR sync failed', error: error.message });
  }
};

// @desc    Mock External Lab Results Fetch
// @route   GET /api/mock-integrations/lab/results/:patientId
// @access  Protected (admin, ot_staff, general_staff)
export const mockLabResultsFetch = async (req: Request, res: Response) => {
  const patientId = req.params.patientId;

  try {
    // Simulate fetching lab results from an external lab system
    console.log(`Simulating fetching lab results for patient ID: ${patientId}`);

    // In a real scenario, this would involve:
    // 1. Authenticating with the lab system's API
    // 2. Querying for results using patientId
    // 3. Parsing and returning relevant data

    // Simulate different results for demonstration
    const mockResults = [
      { testName: 'Blood Glucose', value: '95 mg/dL', status: 'Normal', date: new Date().toISOString() },
      { testName: 'CBC', value: 'WBC 7.5, RBC 4.8', status: 'Normal', date: new Date().toISOString() },
    ];

    // Simulate a failed fetch for a specific patient ID
    if (patientId === 'PAT-FAIL') {
      return res.status(404).json({ message: 'Mock Lab Results not found for this patient ID' });
    }

    if (req.user) {
      await createAuditLog(
        req.user._id.toString(),
        req.user.username,
        'integration_fetch',
        `Simulated lab results fetch for patient ID: ${patientId}`,
        undefined,
        'Integration',
        req
      );
    }

    res.status(200).json(mockResults);
  } catch (error: any) {
    console.error('Error in mock lab results fetch:', error);
    res.status(500).json({ message: 'Mock lab results fetch failed', error: error.message });
  }
};
