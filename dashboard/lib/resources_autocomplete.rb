class ResourcesAutocomplete < AutocompleteHelper
  def self.get_search_matches(query, limit, course_version_id)
    limit = format_limit(limit)

    rows = Resource.limit(limit)
    rows = rows.where(course_version_id: course_version_id)
    return [] if query.length < MIN_WORD_LENGTH
    rows = rows.
      where("LOWER(name) like '%#{query}%' or LOWER(url) like '%#{query}%'")
    return rows.map(&:attributes)
  end
end
