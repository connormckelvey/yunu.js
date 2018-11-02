import { update } from './update'
import { assert } from 'chai'

describe.only('update', function() {
  it('should update the object', () => {
    const subject: any = {
      a: 'b',
      b: { c: { d: 'e' } }
    }
    const subjectJSON = JSON.stringify(subject)
    const updatedSubject = update(subject, { a: { b: 'c' }})
    assert.equal(subjectJSON, JSON.stringify(subject))
    assert.deepEqual(updatedSubject, { ...subject, a: { b: 'c' } })
  })

  it('should update the object via path', () => {
    const subject: any = {
      a: 'b',
      b: { c: { d: 'e', h: 'i' }, f: 'g' }
    }
    const subjectJSON = JSON.stringify(subject)
    const updatedSubject = update(subject, { 'b.c.d': { e: 'fuuuu' } })
    assert.equal(subjectJSON, JSON.stringify(subject))
    assert.deepEqual(updatedSubject, { 
      ...subject, b: { ...subject.b, c: { ...subject.b.c, d: { e: 'fuuuu' } } }
    })
  })
})