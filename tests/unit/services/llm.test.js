const { processNote } = require('../../../services/llm');

jest.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: jest.fn().mockImplementation(() => ({
    getGenerativeModel: jest.fn().mockReturnValue({
      generateContent: jest.fn().mockResolvedValue({
        response: {
          text: () => JSON.stringify({
            checklist: ['Buy medication X'],
            plan: [{ description: 'Take medication daily', startDate: '2025-02-15', duration: 7 }]
          })
        }
      })
    })
  }))
}));

describe('LLM Service', () => {
  it('should process medical notes and extract actionable steps', async () => {
    const note = 'Patient needs to start medication X immediately and take it daily for a week';
    const result = await processNote(note);

    expect(result).toHaveProperty('checklist');
    expect(result).toHaveProperty('plan');
    expect(result.checklist).toBeInstanceOf(Array);
    expect(result.plan).toBeInstanceOf(Array);
  });
});