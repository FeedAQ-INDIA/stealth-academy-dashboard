/**
 * Course Builder Unified Type Definitions (JSDoc)
 * ------------------------------------------------
 * These typedefs describe the NORMALIZED front-end shape used by PreviewBuilder & CourseEditorBuilder.
 * They are intentionally kept in plain JS (JSDoc) so the project (currently JS + Vite) can still benefit
 * from IntelliSense without migrating to TypeScript yet.
 */

/**
 * Generic metadata object (extensible per content type)
 * @typedef {Object.<string, any>} Metadata
 */

/**
 * Base course object (maps to backend Course.entity.js)
 * @typedef {Object} Course
 * @property {number|string} courseId
 * @property {number} userId
 * @property {number|null} orgId
 * @property {string} courseTitle
 * @property {string} [courseDescription]
 * @property {string} [courseImageUrl]
 * @property {number} courseDuration Total duration in seconds (derived)
 * @property {number} [courseValidity]
 * @property {string} [courseSourceChannel]
 * @property {('BYOC'|'INSTRUCTOR_LED')} courseType
 * @property {('ONLINE'|'OFFLINE'|'HYBRID')} deliveryMode
 * @property {('DRAFT'|'PUBLISHED'|'ACTIVE'|'INACTIVE'|'ARCHIVED')} status
 * @property {boolean} [isActive]
 * @property {boolean} [isPublic]
 * @property {Metadata} [metadata]
 * @property {string} [createdAt]
 * @property {string} [updatedAt]
 */

/**
 * Base courseContent (maps to CourseContent.entity.js)
 * @typedef {Object} CourseContentBase
 * @property {number|string} courseContentId
 * @property {number|string} courseId
 * @property {string} courseContentTitle
 * @property {string} [courseContentCategory]
 * @property {('CourseVideo'|'CourseWritten'|'CourseQuiz'|'CourseFlashcard'|'CourseCertificate')} courseContentType
 * @property {number} courseContentSequence
 * @property {boolean} coursecontentIsLicensed
 * @property {number} courseContentDuration
 * @property {boolean} [isActive]
 * @property {boolean} [isPublished]
 * @property {('DRAFT'|'PUBLISHED'|'ARCHIVED'|'ACTIVE'|'INACTIVE'|'UNDER_REVIEW')} [status]
 * @property {Metadata} [metadata]
 * @property {string} [createdAt]
 * @property {string} [updatedAt]
 */

/** @typedef {Object} CourseVideoContent
 *  @property {'CourseVideo'} kind
 *  @property {CourseContentBase} courseContent
 *  @property {Object} courseVideo
 *  @property {number|string} courseVideo.courseVideoId
 *  @property {number|string} courseVideo.courseContentId
 *  @property {number|string} courseVideo.courseId
 *  @property {number} courseVideo.userId
 *  @property {string} courseVideo.courseVideoTitle
 *  @property {string} [courseVideo.courseVideoDescription]
 *  @property {string} courseVideo.courseVideoUrl
 *  @property {number} courseVideo.duration Seconds
 *  @property {string} [courseVideo.thumbnailUrl]
 *  @property {boolean} [courseVideo.isPreview]
 *  @property {('PENDING'|'PROCESSING'|'READY'|'FAILED'|'DRAFT')} [courseVideo.status]
 *  @property {Metadata} [courseVideo.metadata]
 */

/** @typedef {Object} CourseWrittenContent
 *  @property {'CourseWritten'} kind
 *  @property {CourseContentBase} courseContent
 *  @property {Object} courseWritten
 *  @property {number|string} [courseWritten.courseWrittenId]
 *  @property {string} [courseWritten.courseWrittenTitle]
 *  @property {string} [courseWritten.courseWrittenDescription]
 *  @property {string} [courseWritten.courseWrittenContent]
 *  @property {string} [courseWritten.courseWrittenEmbedUrl]
 *  @property {boolean} [courseWritten.courseWrittenUrlIsEmbeddable]
 *  @property {Metadata} [courseWritten.metadata]
 */

/** @typedef {Object} CourseQuizContent
 *  @property {'CourseQuiz'} kind
 *  @property {CourseContentBase} courseContent
 *  @property {Object} courseQuiz
 *  @property {number|string} [courseQuiz.courseQuizId]
 *  @property {string} [courseQuiz.courseQuizDescription]
 *  @property {('CERTIFICATION'|'KNOWLEDGE CHECK')} [courseQuiz.courseQuizType]
 *  @property {boolean} [courseQuiz.isQuizTimed]
 *  @property {number} [courseQuiz.courseQuizTimer]
 *  @property {number} [courseQuiz.courseQuizPassPercent]
 */

/** @typedef {Object} CourseFlashcardContent
 *  @property {'CourseFlashcard'} kind
 *  @property {CourseContentBase} courseContent
 *  @property {Object} courseFlashcard
 *  @property {number|string} [courseFlashcard.courseFlashcardId]
 *  @property {string} courseFlashcard.setTitle
 *  @property {string} [courseFlashcard.setDescription]
 *  @property {('EASY'|'MEDIUM'|'HARD'|'MIXED')} [courseFlashcard.setDifficulty]
 *  @property {string[]} [courseFlashcard.setTags]
 *  @property {string} [courseFlashcard.setCategory]
 *  @property {number} [courseFlashcard.estimatedDuration] Minutes
 *  @property {number} [courseFlashcard.totalFlashcards]
 *  @property {Array<any>} [courseFlashcard.learningObjectives]
 *  @property {number} [courseFlashcard.orderIndex]
 *  @property {('DRAFT'|'PUBLISHED'|'ARCHIVED')} [courseFlashcard.status]
 *  @property {('PUBLIC'|'PRIVATE'|'COURSE_ONLY')} [courseFlashcard.visibility]
 *  @property {boolean} [courseFlashcard.allowShuffling]
 *  @property {boolean} [courseFlashcard.requireSequentialOrder]
 *  @property {number} [courseFlashcard.passingScore]
 *  @property {number} [courseFlashcard.maxAttemptsPerSession]
 *  @property {Metadata} [courseFlashcard.metadata]
 */

/** @typedef {CourseVideoContent|CourseWrittenContent|CourseQuizContent|CourseFlashcardContent} NormalizedContentItem */

/**
 * @typedef {Object} CourseContentDetails
 * @property {number} totalItems
 * @property {Object} statistics
 * @property {number} statistics.videoCount
 * @property {number} statistics.quizCount
 * @property {number} statistics.flashcardCount
 * @property {number} statistics.writtenCount
 * @property {number} totalDuration Seconds
 */

/**
 * @typedef {Object} NormalizedCourseBuilderData
 * @property {Course} course
 * @property {Object} courseBuilder Raw courseBuilder row (plus maybe courseBuilderData)
 * @property {NormalizedContentItem[]} courseContent
 * @property {CourseContentDetails} courseContentDetails
 */

// This file exports nothing; it's for IDE IntelliSense via JSDoc.
export {};