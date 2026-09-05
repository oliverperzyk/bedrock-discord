/**
 * @summary Supported HTTP request methods.
 * @description Verb identifiers used by the internal HTTP client when performing requests.
 */
enum HttpMethod {
    /**
     * @summary GET method.
     * @description Retrieves a resource without sending a request body.
     */
    Get = "GET",
    /**
     * @summary POST method.
     * @description Submits data to create or process a resource.
     */
    Post = "POST",
    /**
     * @summary PUT method.
     * @description Replaces an existing resource at the target URL.
     */
    Put = "PUT",
    /**
     * @summary DELETE method.
     * @description Removes a resource at the target URL.
     */
    Delete = "DELETE",
    /**
     * @summary PATCH method.
     * @description Applies a partial update to an existing resource.
     */
    Patch = "PATCH",
    /**
     * @summary HEAD method.
     * @description Retrieves response headers without the body contents.
     */
    Head = "HEAD",
}

export { HttpMethod }
